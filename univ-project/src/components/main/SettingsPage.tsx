import { useState } from "react";

const SettingsPage = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Settings</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded">
          <span>Email Notifications</span>
          <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
        </div>
        <div className="flex items-center justify-between p-3 border rounded">
          <span>Dark Mode</span>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Account</button>
      </div>
    </div>
  );
};

export default SettingsPage;
