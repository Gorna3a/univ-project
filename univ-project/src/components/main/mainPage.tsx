// src/components/main/MainPage.tsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MainPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md flex items-center px-6 z-50">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">LearnHub</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-auto p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </header>

      {/* Sidebar */}
      <nav className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg p-4 overflow-hidden">
        <ul>
          {[
            { path: 'courses', name: 'Courses' },
            { path: 'challenges', name: 'Challenges' },
            { path: 'chat', name: 'Chat Bot' },
            { path: 'library', name: 'Library' },
            { path: 'profile', name: 'Profile' },
            { path: 'settings', name: 'Settings' },
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className="ml-64 mt-16 p-6">
      <div className="bg-white dark:bg-black rounded-2xl p-6 min-h-[80vh] shadow-md overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainPage;