import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const querySnapshot = await getDocs(collection(db, 'challenge'));
      const challengeList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChallenges(challengeList);
    };

    fetchChallenges();
  }, []);
console.log(challenges)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Available Challenges</h1>

      <div className="grid grid-cols-3 gap-4">
        {challenges.map((challenge, index) => (
          <div key={challenge.id} className="p-4 border rounded-lg text-center">
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
            <h3 className="font-medium mb-2">{challenge.title || `Challenge #${index + 1}`}</h3>
            <Link
              to={`/challeng/${challenge.id}`}
              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;
