import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface LessonData {
  title: string;
  description: string;
  content: string[];
  codeExamples?: {
    code: string;
    explanation: string;
  }[];
  quizzes?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const LessonPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch lesson with topicId:', topicId);

      if (!topicId) {
        throw new Error('No lesson ID provided');
      }

      // 1. First verify the document path is correct
      const docPath = `courses/java/lessons/${topicId}`;
      console.log('Attempting to fetch from path:', docPath);

      // 2. Create the document reference
      const lessonRef = doc(db, 'courses', 'java', 'lessons', topicId);
      console.log('Document reference created:', lessonRef.path);

      // 3. Attempt to get the document
      const lessonSnap = await getDoc(lessonRef);
      console.log('Document snapshot obtained, exists:', lessonSnap.exists());

      if (!lessonSnap.exists()) {
        console.error('Document does not exist at path:', lessonRef.path);
        throw new Error('Lesson not found');
      }

      // 4. Get the data safely
      const lessonData = lessonSnap.data();
      console.log('Raw lesson data from Firestore:', lessonData);

      if (!lessonData) {
        throw new Error('Document exists but has no data');
      }

      // 5. Validate the data structure
      if (!lessonData.title || !lessonData.content) {
        console.error('Invalid lesson structure:', {
          hasTitle: !!lessonData.title,
          hasContent: !!lessonData.content,
          fullData: lessonData
        });
        throw new Error('Invalid lesson format - missing title or content');
      }

      setLesson(lessonData as LessonData);
    } catch (err) {
      console.error('Full error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  fetchLesson();
}, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Lesson data not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          <p className="text-gray-700 mb-6 text-lg">{lesson.description}</p>
          
          {lesson.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
          
          {lesson.codeExamples?.map((example, index) => (
            <div key={index} className="mb-8">
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto mb-2">
                <code className="font-mono text-sm">{example.code}</code>
              </pre>
              <p className="text-gray-600 italic">{example.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;