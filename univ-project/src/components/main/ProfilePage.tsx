import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setDisplayName(userDoc.data().displayName || '');
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          displayName,
          lastActive: new Date()
        });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Refresh user data
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        setUserData(userDoc.data());
      }
    } catch (error) {
      toast.error('Error updating profile');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-md mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your Profile</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-gray-500 dark:text-gray-300">
              {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </div>
        
        <div>
          {isEditing ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-xl font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            />
          ) : (
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {displayName || 'Anonymous User'}
            </h2>
          )}
          <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <h3 className="text-xl font-bold text-blue-500">{userData?.level || 1}</h3>
          <p className="text-gray-600 dark:text-gray-400">Level</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <h3 className="text-xl font-bold text-green-500">{userData?.totalXP || 0}</h3>
          <p className="text-gray-600 dark:text-gray-400">XP</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <h3 className="text-xl font-bold text-yellow-500">
            {userData?.completedLessons?.length || 0}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Lessons</p>
        </motion.div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateProfile}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex-1"
            >
              Cancel
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          >
            Edit Profile
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;