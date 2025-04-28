import { FaBookOpen } from 'react-icons/fa';

const CoursesPage = () => {
  const courses = [
    { title: 'Web Development 101', description: 'Basics of HTML, CSS & JS', progress: 45 },
    { title: 'Advanced TypeScript', description: 'Deep dive into TypeScript features', progress: 10 },
    { title: 'UI/UX Fundamentals', description: 'Design user-friendly interfaces', progress: 70 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Your Courses</h1>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <div>
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FaBookOpen /> {course.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.description}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {course.progress > 0 ? 'Continue' : 'Start'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
