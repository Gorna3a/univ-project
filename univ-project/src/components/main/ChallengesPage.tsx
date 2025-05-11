import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500',
  hard: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-500',
  expert: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-500'
};

interface Challenge {
  id: string;
  title: string;
  difficulty?: keyof typeof DIFFICULTY_COLORS;
  xp: number;
}

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'challenge'));
        const challengeList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || 'Untitled Challenge',
          difficulty: doc.data().difficulty || 'easy',
          xp: doc.data().xp || 10
        }));
        setChallenges(challengeList);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        Coding Challenges
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border dark:border-gray-700 rounded-xl hover:shadow-lg dark:hover:shadow-gray-700/30 transition-shadow bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                DIFFICULTY_COLORS[challenge.difficulty || 'easy']
              }`}>
                {challenge.difficulty}
              </span>
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <span>⭐</span>
                <span className="font-medium">{challenge.xp} XP</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">
              {challenge.title}
            </h3>

            <Link
              to={`/main/challenge/${challenge.id}`}
              className="mt-4 inline-block w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Start Challenge
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;