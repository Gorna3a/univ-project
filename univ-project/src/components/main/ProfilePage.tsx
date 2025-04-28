const ProfilePage = () => {
    const stats = {
      level: 5,
      xp: 1200,
      badges: 3,
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your Profile</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700"></div>
          <div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">John Doe</h2>
            <p className="text-gray-500 dark:text-gray-400">Student</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-blue-500">{stats.level}</h3>
            <p className="text-gray-600 dark:text-gray-400">Level</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-500">{stats.xp}</h3>
            <p className="text-gray-600 dark:text-gray-400">XP</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500">{stats.badges}</h3>
            <p className="text-gray-600 dark:text-gray-400">Badges</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit Profile</button>
      </div>
    );
  };
  
  export default ProfilePage;
  