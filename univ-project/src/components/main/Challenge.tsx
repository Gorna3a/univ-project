import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import classNames from 'classnames';

const Challenge = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!topicId) return;
      const docRef = doc(db, 'challenge', topicId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setChallenge(docSnap.data());
      } else {
        console.log('No challenge found');
      }
    };

    fetchChallenge();
  }, [topicId]);

  const handleSelect = (index: number) => {
    if (answered) return;

    setSelected(index);
    setAnswered(true);

    // Ensure challenge exists before trying to access correctAnswer
    if (challenge && challenge.correctAnswer) {
      setIsWinner(index === parseInt(challenge.correctAnswer));
    }

    setTimeout(() => {
      setShowOverlay(true); // Show overlay after selection
    }, 500);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleBackToChallenges = () => {
    navigate('/main/challenges'); // Adjust the route as needed
  };

  // Guard clause: Ensure challenge exists before rendering the rest
  if (!challenge) {
    return <p className="p-6">Loading challenge...</p>;
  }

  const correctIndex = parseInt(challenge.correctAnswer);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl relative min-h-[500px]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🧠 Challenge</h1>
      <p className="text-lg mb-6 text-gray-700 dark:text-gray-200">{challenge.question}</p>

      <div className="grid gap-4">
        {challenge.options.map((option: string, index: number) => {
          const isCorrect = index === correctIndex;
          const isSelected = index === selected;

          const buttonClass = classNames(
            'p-4 rounded-lg border font-mono text-sm whitespace-pre-wrap transition-all duration-200',
            {
              'bg-green-500 text-white border-green-600 shadow-lg scale-[1.02]': answered && isCorrect,
              'bg-red-500 text-white border-red-600': answered && isSelected && !isCorrect,
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer transform hover:scale-[1.02]': !answered,
              'opacity-70 cursor-not-allowed': answered && !isSelected && !isCorrect,
            }
          );

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleSelect(index)}
              disabled={answered}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Enhanced Overlay for Win or Loss */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ${isWinner ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
            <button 
              onClick={handleCloseOverlay}
              className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">
                {isWinner ? '🎉' : '😢'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isWinner ? 'You Win!' : 'Hard Luck!'}
              </h2>
              <p className="text-xl text-white mb-6">
                {isWinner ? 'Congrats, correct answer!' : 'Better luck next time!'}
              </p>
              
              {!isWinner && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                  <p className="text-white font-medium">Correct answer:</p>
                  <p className="text-white font-bold">{challenge.options[correctIndex]}</p>
                </div>
              )}
              
              <button
                onClick={handleBackToChallenges}
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Back to Challenges
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenge;