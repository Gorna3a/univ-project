import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Challenge = () => {
  const { topicId } = useParams();
  const [challenge, setChallenge] = useState<any>(null);
console.log(topicId)
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

  if (!challenge) {
    return <p className="p-6">Loading challenge...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{challenge.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{challenge.description}</p>
        {challenge.code && (
            <pre className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-md overflow-auto">
            <code>{challenge.code}</code>
            </pre>
        )}
    </div>
  );
};

export default Challenge;
