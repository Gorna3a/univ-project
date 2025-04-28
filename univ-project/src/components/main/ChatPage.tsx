import { useState, useRef, useEffect } from 'react';
import { OpenAI } from 'openai';

// Initialize OpenAI client once
const client = new OpenAI({
  apiKey: import.meta.env.VITE_KLUSTERAI_API_KEY,
  baseURL: 'https://api.kluster.ai/v1',
  dangerouslyAllowBrowser: true,
});

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when a new response arrives
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);

    try {
      const completion = await client.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-V3-0324',
        max_completion_tokens: 4000,
        temperature: 0.6,
        top_p: 1,
        messages: [
          { role: 'user', content: message },
          { role: 'system', content: `greet the user if they are not asking for something about programming , don't answer anything else but programming just to keep user focused ,answer just the necessary things in short description and don't talk too much , use emojis and style the writing to be better , if the user asks about something else from programming give them a friendly reminder that they are supposed to be studiying in funny way , use slang words to add fun and details to text , act like the user is your friend and teach him like in fun way not boring , try promoting user from time to time if the user keeps stuying , and ask some quetions from time to time if the user answers correctly you encourage them` }
        ],
      });
      setResponse(completion.choices[0].message.content || 'No response');
    } catch (error) {
      console.error('API Error:', error);
      setResponse('Error fetching response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl flex flex-col h-[80vh]">
      <h2 className="text-2xl font-semibold text-center text-gray-800">AI Chatbot</h2>

      <div
        ref={responseRef}
        className="flex-1 mt-4 p-4 bg-gray-50 rounded-lg overflow-y-auto space-y-2 max-h-full"
      >
        {response ? (
          <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
        ) : (
          <p className="text-gray-400">Your AI responses will appear here...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex space-x-3 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
    </div>
  );
};

export default ChatPage;
