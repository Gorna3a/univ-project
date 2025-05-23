import { useState, useRef, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthProvider';
import MarkdownText from '../../lib/MarkdownText';
import { chatCompletion } from '../../services/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
  userId: string;
}

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const streamingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get current chat messages
  const currentMessages = currentChatId 
    ? chatHistory.find(chat => chat.id === currentChatId)?.messages || []
    : [];

  // Load history from Firestore
  useEffect(() => {
    if (!user?.uid) {
      setChatHistory([]);
      return;
    }

    const chatsRef = collection(db, 'users', user.uid, 'chats');
    const q = query(chatsRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: ChatHistory[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          title: data.title,
          timestamp: data.timestamp.toDate(),
          messages: data.messages,
          userId: user.uid
        });
      });
      setChatHistory(history);
    }, (error) => {
      setError('Failed to load chat history');
      console.error('Error loading chats:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const saveChatToFirebase = async (chat: ChatHistory) => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const chatRef = doc(db, 'users', user.uid, 'chats', chat.id);
      await setDoc(chatRef, {
        title: chat.title,
        messages: chat.messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        timestamp: new Date(chat.timestamp),
        userId: user.uid
      }, { merge: true });
    } catch (error) {
      setError('Failed to save chat');
      console.error('Error saving chat:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    const userMessage: Message = { role: 'user', content: message };
    let updatedHistory = [...chatHistory];
    let currentChat: ChatHistory;

    // Create new chat if none is selected
    if (!currentChatId) {
      currentChat = {
        id: Date.now().toString(),
        title: message.slice(0, 15) + (message.length > 15 ? '...' : ''),
        timestamp: new Date(),
        messages: [userMessage],
        userId: user.uid
      };
      updatedHistory = [currentChat, ...chatHistory];
      setCurrentChatId(currentChat.id);
    } else {
      // Add to existing chat
      currentChat = updatedHistory.find(chat => chat.id === currentChatId)!;
      currentChat.messages = [...currentChat.messages, userMessage];
      currentChat.timestamp = new Date();
    }

    setChatHistory(updatedHistory);
    setMessage('');
    setIsLoading(true);
    streamingRef.current = true;

    try {
      // Add empty assistant message for streaming
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: '', 
        isStreaming: true 
      };
      const streamingChat = {
        ...currentChat,
        messages: [...currentChat.messages, assistantMessage],
        timestamp: new Date()
      };
      
      const updatedChatIndex = updatedHistory.findIndex(chat => chat.id === currentChat.id);
      updatedHistory[updatedChatIndex] = streamingChat;
      setChatHistory(updatedHistory);

      // Create new AbortController for this stream
      abortControllerRef.current = new AbortController();

      // Start streaming response
      let fullResponse = '';
      await chatCompletion({
        messages: currentChat.messages.map(msg => ({ 
          role: msg.role, 
          content: msg.content 
        })),
        onChunk: (chunk) => {
          if (!streamingRef.current) return;
          fullResponse += chunk;
          
          setChatHistory(prev => {
            const newHistory = [...prev];
            const chatToUpdate = newHistory.find(chat => chat.id === currentChat.id);
            if (chatToUpdate) {
              const lastMessage = chatToUpdate.messages[chatToUpdate.messages.length - 1];
              if (lastMessage.role === 'assistant') {
                lastMessage.content = fullResponse;
              }
            }
            return newHistory;
          });
        },
        signal: abortControllerRef.current.signal
      });

      // Final save with complete response
      const completeChat = {
        ...streamingChat,
        messages: streamingChat.messages.map(m => ({
          ...m,
          isStreaming: false
        }))
      };
      
      setChatHistory(prev => {
        const newHistory = [...prev];
        const chatIndex = newHistory.findIndex(chat => chat.id === currentChat.id);
        if (chatIndex !== -1) {
          newHistory[chatIndex] = completeChat;
        }
        return newHistory;
      });

      await saveChatToFirebase(completeChat);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: string }).name !== 'AbortError'
      ) {
        setError('Failed to get AI response');
        console.error('API Error:', error);
        
        const errorMessage: Message = { 
          role: 'assistant', 
          content: '⚠️ Failed to get response. Try again later.' 
        };
        
        const updatedChatIndex = updatedHistory.findIndex(chat => chat.id === currentChatId);
        if (updatedChatIndex !== -1) {
          updatedHistory[updatedChatIndex] = {
            ...updatedHistory[updatedChatIndex],
            messages: [...updatedHistory[updatedChatIndex].messages.filter(m => !m.isStreaming), errorMessage],
            timestamp: new Date()
          };
          setChatHistory(updatedHistory);
          await saveChatToFirebase(updatedHistory[updatedChatIndex]);
        }
      }
    } finally {
      setIsLoading(false);
      streamingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
  };

  const loadChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = async (chatId: string) => {
    try {
      if (!user?.uid) return;
      await deleteDoc(doc(db, 'users', user.uid, 'chats', chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
    } catch (error) {
      setError('Failed to delete chat');
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className={`flex max-h-screen h-screen dark:bg-gray-900 bg-gray-100`}>
      {/* History Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-500/10 to-purple-500/10 backdrop-blur-sm p-4 flex flex-col">
        <div className="text-center mb-4">
          <h3 className={`text-xl font-bold dark:text-gray-100 text-gray-700`}>Chat History</h3>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button 
            onClick={startNewChat}
            className={`mt-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors`}
          >
            + New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            <p className={`text-center mt-4 dark:text-white text-gray-500`}>Sign in to save chats</p>
          ) : chatHistory.length === 0 ? (
            <p className={`text-center mt-4 dark:text-white text-gray-500`}>No chat history yet</p>
          ) : (
            <div className="space-y-2">
              {chatHistory.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium truncate dark:text-gray-100 text-gray-700`}>{chat.title}</p>
                      <p className={`text-xs dark:text-gray-400 text-gray-500`}>
                        {chat.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className={`p-4 shadow-sm bg-transparent`}>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {currentChatId ? 'AI Chat' : 'New Chat'}
            {isSaving && <span className="text-xs text-gray-500 ml-2 dark:text-gray-100">Saving...</span>}
          </h2>
        </div>

        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
          {currentMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-600 dark:text-gray-200">
                <p>Send a message to start chatting!</p>
                <p className="text-sm mt-2">Try asking about programming concepts</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3xl rounded-2xl p-4 relative ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {msg.isStreaming && (
                      <div className="absolute bottom-1 right-2 flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                    <MarkdownText text={msg.content} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || !user}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim() || !user}
              className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white dark:text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </form>
          {!user && (
            <p className="text-sm text-red-500 mt-2">Please sign in to chat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;