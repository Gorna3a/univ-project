import { FaBook, FaVideo, FaCode, FaFileAlt } from 'react-icons/fa';

const resources = [
  {
    title: 'eBooks',
    icon: <FaBook />,
    link: 'https://www.pdfdrive.com/',
    description: 'Free programming ebooks',
  },
  {
    title: 'Video Tutorials',
    icon: <FaVideo />,
    link: 'https://www.youtube.com/c/Freecodecamp',
    description: 'Hands-on coding tutorials',
  },
  {
    title: 'Code Examples',
    icon: <FaCode />,
    link: 'https://github.com/',
    description: 'Real-world project code',
  },
  {
    title: 'Research Papers',
    icon: <FaFileAlt />,
    link: 'https://arxiv.org/',
    description: 'Scientific publications & papers',
  },
];

const LibraryPage = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Resource Library</h1>
    <div className="grid grid-cols-2 gap-4">
      {resources.map((res, index) => (
        <a
          key={index}
          href={res.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <div className="text-2xl text-blue-500">{res.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{res.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{res.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default LibraryPage;
