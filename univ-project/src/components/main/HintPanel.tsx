import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { generateChallengeHint } from '../../services/ai';

interface HintPanelProps {
  question: string;
  options: string[];
  staticHint?: string;
}

const HintPanel = ({ question, options, staticHint }: HintPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState(staticHint || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateHint = async () => {
    setIsLoading(true);
    setError('');
    try {
      const aiHint = await generateChallengeHint(question, options);
      setHint(aiHint || 'No hint available');
    } catch (error) {
      setError('Failed to generate hint');
      setHint(staticHint || 'No hint available');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Challenge Assistant
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateHint}
                  disabled={isLoading}
                  className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400"
                >
                  {isLoading ? 'Generating...' : 'New Hint'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400"
                >
                  Close
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <div className="min-h-[80px] p-3 bg-blue-50/50 dark:bg-gray-700/50 rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center h-full space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : (
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                  {hint || 'Click "New Hint" for assistance'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center text-white text-xl transition-colors"
      >
        {isOpen ? '×' : '?'}
      </motion.button>
    </div>
  );
};

export default HintPanel;