import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const auth = getAuth();
  const [settings, setSettings] = useState({
    emailNotifs: true,
    darkMode: false,
    fontStyle: "inter"
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Font options with display names
  const fontOptions = [
    { id: "inter", name: "Inter (Default)", className: "font-sans" },
    { id: "pixel", name: "Pixel", className: "font-pixel" },
    { id: "retro", name: "Retro", className: "font-retro" },
    { id: "mono", name: "Monospace", className: "font-mono" }
  ];

 

  useEffect(() => {
    const loadSettings = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().preferences) {
          setSettings({
            emailNotifs: userDoc.data().emailNotifs ?? true,
            darkMode: userDoc.data().preferences.darkMode ?? false,
            fontStyle: userDoc.data().preferences.fontStyle ?? "inter"
          });
        }
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [auth.currentUser]);

  const updateSetting = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          emailNotifs: newSettings.emailNotifs,
          preferences: {
            darkMode: newSettings.darkMode,
            fontStyle: newSettings.fontStyle
          }
        });
        
        // Apply font style to the whole app
        document.documentElement.className = newSettings.fontStyle;
        
        // Apply dark mode
        if (newSettings.darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        toast.success("Settings saved!");
      } catch (error) {
        toast.error("Failed to save settings");
        console.error(error);
      }
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    toast("Account deletion would be implemented here");
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Settings</h1>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Notifications</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.emailNotifs}
                onChange={() => updateSetting("emailNotifs", !settings.emailNotifs)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Appearance</h2>
          
          <div className="flex items-center justify-between py-2 mb-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.darkMode}
                onChange={() => updateSetting("darkMode", !settings.darkMode)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-500"></div>
            </label>
          </div>
          
          <div className="py-2">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Font Style</p>
            <div className="grid grid-cols-2 gap-3">
              {fontOptions.map((font) => (
                <motion.button
                  key={font.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 border rounded-lg text-center transition-all ${font.className} ${
                    settings.fontStyle === font.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => updateSetting("fontStyle", font.id)}
                >
                  {font.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Learning Preferences */}
        

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-300">Danger Zone</h2>
          
          <AnimatePresence>
            {showDeleteConfirm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="mb-4 text-red-600 dark:text-red-400">Are you sure you want to delete your account? This cannot be undone.</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={handleDeleteAccount}
                  >
                    Confirm Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;