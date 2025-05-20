import { useTheme } from '../../context/ThemeContext';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  Flame,
  Bot,
  Library,
  User,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: 'courses', label: 'Courses', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { to: 'challenges', label: 'Challenges', icon: <Flame className="w-5 h-5 mr-2" /> },
  { to: 'chat', label: 'Chat Bot', icon: <Bot className="w-5 h-5 mr-2" /> },
  { to: 'library', label: 'Library', icon: <Library className="w-5 h-5 mr-2" /> },
  { to: 'profile', label: 'Profile', icon: <User className="w-5 h-5 mr-2" /> },
  { to: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> },
];

const MainPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md flex items-center px-6 z-50">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">LearnHub</h1>

        {/* Toggle Switch */}
        <div className="ml-auto flex items-center">
          <span className="text-sm mr-2 text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300
              ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </button>
          <NavLink to={"/login"}>
            <button className="bg-red-500 rounded-lg text-white px-2.5 py-1.5 ml-2">log out</button>
          </NavLink>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg p-4">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 min-h-[80vh] shadow-md transition-all">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
