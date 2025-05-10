import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const LessonPage = () => {
  const { topicId } = useParams();
  const [lesson, setLesson] = useState<any>(null);
console.log("Topic :"+topicId)
useEffect(() => {
  const fetchLesson = async () => {
    if (!topicId) return;

    const docRef = doc(db, 'courses', 'java', 'lessons', topicId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Fetched lesson:', docSnap.data()); 
      setLesson(docSnap.data());
    } else {
      console.log('No lesson found');
    }
  };

  fetchLesson();
}, [topicId]);

useEffect(() => {
  console.log('Lesson updated:', lesson);
}, [lesson]);

  
  if (!lesson) return <p className="p-6">Loading lesson...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="mb-4">{lesson.content}</p>
      {lesson.code && (
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto">
          <code>{lesson.code}</code>
        </pre>
      )}
    </div>
  );
};

export default LessonPage;
