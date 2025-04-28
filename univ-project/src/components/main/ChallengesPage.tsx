const ChallengesPage = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Daily Challenges</h1>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="p-4 border rounded-lg text-center">
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
            <h3 className="font-medium">Challenge #{num}</h3>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Start Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  export default ChallengesPage;