import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import HintPanel from './HintPanel';

interface ChallengeData {
  question: string;
  options: { [key: string]: string };
  correctAnswer: string;
  xp: number;
  difficulty: string;
  hint?: string;
  explanations?: { [key: string]: string };
}

const Challenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        if (!challengeId) return;
        
        const docRef = doc(db, 'challenge', challengeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ChallengeData;
          setChallenge(data);
        } else {
          navigate('/main/challenges', { replace: true });
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, navigate]);

  const handleSelect = (index: number) => {
    if (!challenge || answered) return;

    const isCorrect = index.toString() === challenge.correctAnswer;
    setSelected(index);
    setAnswered(true);
    
    setTimeout(() => {
      setShowOverlay(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl min-h-[500px] flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Challenge not found</p>
      </div>
    );
  }

  const optionsArray = Object.entries(challenge.options)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([_, value]) => value);

  const correctIndex = parseInt(challenge.correctAnswer);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl min-h-[500px] relative">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400' :
          'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
        }`}>
          {challenge.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400 text-xs font-semibold">
          {challenge.xp} XP
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {challenge.question}
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 mb-8"
      >
        {optionsArray.map((option, index) => {
          const isCorrect = index.toString() === challenge.correctAnswer;
          const isSelected = index === selected;

          return (
            <motion.button
              key={index}
              initial={{ scale: 1 }}
              whileHover={!answered ? { scale: 1.02 } : {}}
              className={`w-full p-4 text-left rounded-xl border transition-all font-mono text-sm
                ${answered
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-800/20 dark:border-green-500/50 dark:text-green-400'
                    : isSelected
                      ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-800/20 dark:border-red-500/50 dark:text-red-400'
                      : 'opacity-50 cursor-not-allowed dark:opacity-40'
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'}`}
              onClick={() => handleSelect(index)}
              disabled={answered}
            >
              <pre className="whitespace-pre-wrap text-sm">{option}</pre>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative max-w-md w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl"
            >
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">
                  {selected === correctIndex ? '🎉' : '😢'}
                </div>
                
                <h2 className="text-2xl font-bold mb-4 dark:text-white">
                  {selected === correctIndex ? 'Challenge Passed!' : 'Try Again!'}
                </h2>
                
                <div className="space-y-2 mb-6">
                  {selected === correctIndex ? (
                    <p className="text-lg dark:text-gray-300">
                      You earned {challenge.xp} XP!
                    </p>
                  ) : (
                    <div className="space-y-3 text-left">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Your answer: {optionsArray[selected!]}
                        </p>
                        {challenge.explanations?.[selected?.toString()!] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {challenge.explanations[selected?.toString()!]}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Correct answer: {optionsArray[correctIndex]}
                        </p>
                        {challenge.explanations?.[challenge.correctAnswer] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {challenge.explanations[challenge.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/main/challenges')}
                  className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Back to Challenges
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HintPanel 
        question={challenge.question}
        options={Object.values(challenge.options)}
        staticHint={challenge.hint}
      />
    </div>
  );
};

export default Challenge;