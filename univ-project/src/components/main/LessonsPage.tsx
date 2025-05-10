import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import MarkdownText from '../../lib/MarkdownText';
import { motion } from 'framer-motion';


const LessonPage = () => {
  const { topicId } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!topicId) {
          throw new Error('No lesson ID provided');
        }

        const docRef = doc(db, 'courses', 'java', 'lessons', topicId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLesson(docSnap.data());
        } else {
          throw new Error('Lesson not found');
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [topicId]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex justify-center items-center h-64">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 bg-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-3xl mx-auto bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800"
      >
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Error Loading Lesson</h2>
        <p className="mt-2 text-red-500 dark:text-red-300">{error}</p>
      </motion.div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p>Lesson not available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-3xl mx-auto"
    >
      
      
      {/* Lesson Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {lesson.title}
        </h1>
        
        {lesson.subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {lesson.subtitle}
          </p>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <MarkdownText text={lesson.content} />
        </div>

       

        {lesson.code && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto">
              <code>{lesson.code}</code>
            </pre>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LessonPage;