import { useEffect, useState } from 'react';
import { FaJava, FaPlay, FaArrowRight } from 'react-icons/fa';
import { db } from '../../firebase'; // Adjust the path if needed
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export const javaTopics = [
  { id: 'intro', title: 'Introduction to Java', description: 'History, features, and setup of Java.', level: 'Beginner' },
  { id: 'variables', title: 'Variables and Data Types', description: 'Primitive types, variables, and type casting.', level: 'Beginner' },
  { id: 'cond', title: 'Control Flow', description: 'Conditional logic and loops.', level: 'Beginner' },
  { id: 'func', title: 'Methods and Scope', description: 'Function declarations and scoping rules.', level: 'Beginner' },
  { id: 'POO', title: 'OOP Concepts', description: 'Classes, inheritance, and encapsulation.', level: 'Intermediate' },
  { id: 'arr', title: 'Arrays and Strings', description: 'Data structures and String manipulation.', level: 'Intermediate' },
  { id: 'err', title: 'Exception Handling', description: 'Errors, try-catch blocks, and throwing exceptions.', level: 'Intermediate' },
  { id: 'list', title: 'Collections Framework', description: 'Lists, Sets, Maps, and Generics.', level: 'Advanced' },
  { id: 'IO', title: 'File I/O', description: 'Reading and writing files using Java.', level: 'Advanced' },
  { id: 'API', title: 'Java Streams', description: 'Functional programming using the Stream API.', level: 'Advanced' },
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      const progressRef = collection(db, 'users', user.uid, 'progress');
      const snapshot = await getDocs(progressRef);

      const map: Record<string, number> = {};
      snapshot.forEach(doc => {
        map[doc.id] = doc.data().progress || 0;
      });

      setProgressMap(map);
    };

    fetchProgress();
  }, [user]);

  const handleProgressUpdate = async (topicId: string) => {
    if (!user) return;

    const newProgress = Math.min((progressMap[topicId] || 0) + 10, 100);
    const docRef = doc(db, 'users', user.uid, 'progress', topicId);
    await setDoc(docRef, { progress: newProgress });

    setProgressMap(prev => ({ ...prev, [topicId]: newProgress }));
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
        <FaJava className="text-blue-500 text-4xl " /> Java Learning Path
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {javaTopics.map((topic, index) => {
          const progress = progressMap[topic.id] || 0;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {topic.title}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    topic.level === 'Beginner'
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                      : topic.level === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                  }`}
                >
                  {topic.level}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {topic.description}
              </p>

              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button
                    onClick={() => navigate(`/lesson/${topic.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all"
                  >
                  {progress > 0 ? <><FaArrowRight /> Continue</> : <><FaPlay /> Start</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;



