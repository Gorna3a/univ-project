import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

interface UserSettings {
  emailNotifs: boolean;
  darkMode: boolean;
  fontStyle: string;
}


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
  ] as const;



  useEffect(() => {
    const loadSettings = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setSettings({
              emailNotifs: data.emailNotifs ?? true,
              darkMode: data.preferences?.darkMode ?? false,
              fontStyle: data.preferences?.fontStyle ?? "inter"
            });
            
            // Apply loaded settings immediately
            applySettings({
              darkMode: data.preferences?.darkMode ?? false,
              fontStyle: data.preferences?.fontStyle ?? "inter"
            });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          toast.error("Failed to load settings");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadSettings();
  }, [auth.currentUser]);

   const applySettings = (settings: { darkMode: boolean; fontStyle: string }) => {
    // Remove all font classes first
    document.documentElement.classList.remove(
      "font-sans", "font-pixel", "font-retro", "font-mono"
    );
    
    // Add the selected font class
    const selectedFont = fontOptions.find(f => f.id === settings.fontStyle);
    if (selectedFont) {
      document.documentElement.classList.add(selectedFont.className);
    }
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (!auth.currentUser) {
      toast.error("You must be logged in to save settings");
      return;
    }

    try {
      // Prepare the update object
      const updateData: any = {
        emailNotifs: newSettings.emailNotifs,
        preferences: {
          darkMode: newSettings.darkMode,
          fontStyle: newSettings.fontStyle
        }
      };

      await updateDoc(doc(db, "users", auth.currentUser.uid), updateData);
      
      // Apply visual changes
      applySettings({
        darkMode: newSettings.darkMode,
        fontStyle: newSettings.fontStyle
      });

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
      // Revert to previous settings on error
      setSettings(settings);
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
  const { theme, toggleTheme } = useTheme();

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
  <div className="ml-auto flex items-center">
    <span className="text-sm mr-2 text-gray-600 dark:text-gray-300">
      {settings.darkMode ? 'Dark' : 'Light'}
    </span>
    <button
      onClick={() => {updateSetting('darkMode', !settings.darkMode); toggleTheme();}}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
        settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      aria-label={`Toggle dark mode - currently ${settings.darkMode ? 'dark' : 'light'}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          settings.darkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      ></div>
    </button>
  </div>
</div>
          
          <div className="py-2">
            <p className="font-medium text-gray-700 dark:text-gray-100 mb-2">Font Style</p>
            <div className="grid grid-cols-2 gap-3">
              {fontOptions.map((font) => (
                <motion.button
                  key={font.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`text-gray-700 dark:text-gray-100 p-3 border rounded-lg text-center transition-all ${font.className} ${
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