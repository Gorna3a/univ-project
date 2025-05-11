import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import MarkdownRenderer from '../../lib/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { javaTopics } from './CoursesPage'; // Import your topics array
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  xp?: number;
  completed?: boolean;
}

interface Lesson {
  title: string;
  content: string;
  xp: number;
  quizzes: Quiz[];
}

interface CompletedQuiz {
  quizId: string;
  completed: boolean;
}

interface CompletedLesson {
  lessonId: string;
  completed: boolean;
  quizzes: CompletedQuiz[];
}

interface UserData {
  completedLessons?: CompletedLesson[];
  [key: string]: any; // For any additional user properties
}


const LessonPage = () => {
 const [user] = useAuthState(auth);
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [nextTopicId, setNextTopicId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});

  // Find current topic index and set next topic
  useEffect(() => {
    if (topicId) {
      const currentIndex = javaTopics.findIndex(topic => topic.id === topicId);
      if (currentIndex !== -1 && currentIndex < javaTopics.length - 1) {
        setNextTopicId(javaTopics[currentIndex + 1].id);
      }
    }
  }, [topicId]);

  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      if (!topicId) return;
      setIsExiting(false);

      try {
        // Fetch lesson data
        const docRef = doc(db, 'courses', 'java', 'lessons', topicId);
        const docSnap = await getDoc(docRef);
        const quizzesRef = collection(db, 'courses', 'java', 'lessons', topicId, 'quiz');
        const quizzesSnapshot = await getDocs(quizzesRef);

        if (docSnap.exists()) {
          const lessonData = docSnap.data() as Omit<Lesson, 'quizzes'>;
          const quizzesData = quizzesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Quiz));

          // Fetch user progress if logged in
          let completedQuizzesMap: Record<string, boolean> = {};
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data() as UserData;
              const lessonProgress = userData.completedLessons?.find((l: CompletedLesson) => l.lessonId === topicId);
              
              if (lessonProgress) {
                lessonProgress.quizzes.forEach((q: CompletedQuiz) => {
                  completedQuizzesMap[q.quizId] = q.completed;
                });
              }
            }
          }

          setCompletedQuizzes(completedQuizzesMap);
          setLesson({
            ...lessonData,
            quizzes: quizzesData
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLessonAndProgress();
  }, [topicId, user]);

  const updateUserProgress = async (quizId: string, isCompleted: boolean) => {
    if (!user || !topicId || !lesson) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData: UserData = userSnap.exists() 
        ? (userSnap.data() as UserData)
        : { completedLessons: [] };

      // Find or create lesson progress
      let lessonProgress = userData.completedLessons?.find((l: CompletedLesson) => l.lessonId === topicId);
      if (!lessonProgress) {
        lessonProgress = {
          lessonId: topicId,
          completed: false,
          quizzes: []
        };
        userData.completedLessons = [...(userData.completedLessons || []), lessonProgress];
      }

      // Find or create quiz progress
      const quizProgress = lessonProgress.quizzes.find((q: CompletedQuiz) => q.quizId === quizId);
      if (quizProgress) {
        quizProgress.completed = isCompleted;
      } else {
        lessonProgress.quizzes.push({
          quizId,
          completed: isCompleted
        });
      }

      // Check if all quizzes are completed
      const allQuizzesCompleted = lesson.quizzes.every(q => 
        lessonProgress.quizzes.some(qp => qp.quizId === q.id && qp.completed)
      );
      
      if (allQuizzesCompleted) {
        lessonProgress.completed = true;
      }

      await updateDoc(userRef, {
        completedLessons: userData.completedLessons
      });

    } catch (error) {
      console.error("Error updating user progress:", error);
    }
  };

  const checkAnswer = async () => {
    if (!lesson?.quizzes || !topicId || !currentQuiz) return;
    
    const isCorrect = selectedOption?.toString() === currentQuiz.correctAnswer;
    setIsWinner(isCorrect);
    setCorrectAnswerText(currentQuiz.options[parseInt(currentQuiz.correctAnswer)]);
    setShowResult(true);
    setShowOverlay(true);
    
    if (isCorrect) {
      try {
        // Update quiz completion in Firestore
        const quizRef = doc(db, 'courses', 'java', 'lessons', topicId, 'quiz', currentQuiz.id);
        await updateDoc(quizRef, {
          completed: true
        });
        
        // Update local state
        setCompletedQuizzes(prev => ({
          ...prev,
          [currentQuiz.id]: true
        }));
        
        // Update user progress
        await updateUserProgress(currentQuiz.id, true);
        
      } catch (error) {
        console.error("Error updating quiz status:", error);
      }
    }
  };
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const navigateToNextTopic = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (nextTopicId) {
        navigate(`/lesson/${nextTopicId}`);
      } else {
        navigate('/main/courses');
      }
    }, 500); 
  };

  const navigateToCourses = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/main/courses');
    }, 500);
  };
 const handleNextQuiz = () => {
    setShowQuiz(true);
  };

  const handleOptionSelect = (index: number) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };  
  const currentQuiz = lesson?.quizzes?.[currentQuizIndex];

  if (!lesson) return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      />
    </div>
  );

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
          <div className="max-w-4xl mx-auto">
            {/* Navigation Header */}
            <div className="flex justify-between items-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToCourses}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Courses
              </motion.button>
              
              {nextTopicId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToNextTopic}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  Next Lesson
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Lesson Content Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
            >
              <div className="p-8">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-800 mb-6"
                >
                  {lesson.title}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="prose max-w-none"
                >
                  <MarkdownRenderer content={lesson.content} />
                </motion.div>
                
               {!showQuiz && lesson.quizzes?.length > 0 && (
  // Check if any quiz is not completed
  lesson.quizzes.some(quiz => !completedQuizzes[quiz.id]) && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-8 flex justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextQuiz}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md"
      >
        Start Quiz
      </motion.button>
    </motion.div>
  )
)}
              </div>
            </motion.div>

            {/* Quiz Section */}
            {showQuiz && currentQuiz && (
  !completedQuizzes[currentQuiz.id] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz</h2>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                  >
                    <p className="text-lg font-medium text-gray-700 mb-4">{currentQuiz.question}</p>
                    
                    <div className="space-y-3">
                      {currentQuiz.options.map((option: string, index: number) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: !showResult ? 1.02 : 1 }}
                          whileTap={{ scale: !showResult ? 0.98 : 1 }}
                          onClick={() => handleOptionSelect(index)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedOption === index 
                              ? showResult 
                                ? index.toString() === currentQuiz.correctAnswer
                                  ? 'bg-green-50 border-green-500 shadow-green-sm'
                                  : 'bg-red-50 border-red-500 shadow-red-sm'
                                : 'bg-blue-50 border-blue-500 shadow-blue-sm'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className={`mr-3 inline-flex items-center justify-center h-6 w-6 rounded-full ${
                              selectedOption === index 
                                ? showResult 
                                  ? index.toString() === currentQuiz.correctAnswer
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                            {showResult && index.toString() === currentQuiz.correctAnswer && (
                              <span className="ml-auto text-green-500 font-medium">✓ Correct</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {!showResult ? (
                    <motion.div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkAnswer}
                        disabled={selectedOption === null}
                        className={`px-8 py-3 font-medium rounded-lg shadow-md ${
                          selectedOption === null
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        }`}
                      >
                        Check Answer
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center mt-6"
                    >
                      <motion.p 
                        className={`text-lg font-medium ${
                          selectedOption?.toString() === currentQuiz.correctAnswer
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {selectedOption?.toString() === currentQuiz.correctAnswer
                          ? '🎉 Correct! Well done!'
                          : 'Oops! Try again next time.'}
                      </motion.p>
                      
                      <motion.div className="flex gap-3">
                        {currentQuizIndex < lesson.quizzes.length - 1 ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentQuizIndex(currentQuizIndex + 1);
                              setSelectedOption(null);
                              setShowResult(false);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md"
                          >
                            Next Question
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowQuiz(false)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md"
                          >
                            Finish Quiz
                          </motion.button>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl ${
                isWinner
                  ? 'bg-gradient-to-br from-green-400 to-green-600'
                  : 'bg-gradient-to-br from-red-400 to-red-600'
              }`}
            >
              <button
                onClick={handleCloseOverlay}
                className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8 text-center">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isWinner ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                  className="text-6xl mb-4"
                >
                  {isWinner ? '🎉' : '😢'}
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isWinner ? 'You Win!' : 'Try Again!'}
                </h2>
                
                <p className="text-xl text-white mb-6">
  {isWinner ? (
    <>
      <span className="block">🌟 Correct! Well done!</span>
      <span className="block text-yellow-200 mt-2">
        You've earned {lesson.xp} experience points!
      </span>
      {currentQuizIndex < lesson.quizzes.length - 1 ? (
        <span className="block text-sm opacity-80 mt-2">
          {lesson.quizzes.length - currentQuizIndex - 1} questions remaining
        </span>
      ) : (
        <span className="block text-sm opacity-80 mt-2">
          You've completed this quizz perfectly!
        </span>
      )}
    </>
  ) : (
    <>
      <span className="block">Oops! That's not correct</span>
      <span className="block text-sm opacity-80 mt-2">
        Don't worry - you'll get it next time!
      </span>
      {currentQuizIndex < lesson.quizzes.length - 1 && (
        <span className="block text-sm opacity-80 mt-1">
          {lesson.quizzes.length - currentQuizIndex - 1} chances left to earn XP
        </span>
      )}
    </>
  )}
</p>

                {!isWinner && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <p className="text-white font-medium">Correct answer was:</p>
                    <p className="text-white font-bold text-lg mt-1">
                      {correctAnswerText}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCloseOverlay}
                    className="px-6 py-2 bg-white bg-opacity-90 text-gray-800 font-semibold rounded-full hover:bg-opacity-100 transition-colors duration-200 shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.div>
        
      )}
    </AnimatePresence>
  );
};

export default LessonPage;