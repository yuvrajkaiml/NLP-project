import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ErrorToast: React.FC = () => {
  const { error, dismissError } = useApp();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dismissError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dismissError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-surface-raised dark:bg-surface-dark-raised border border-rose-200 dark:border-rose-900 shadow-lift flex items-start space-x-3"
          role="alert"
        >
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider">
              Translation Notice
            </h4>
            <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5 leading-relaxed">
              {error}
            </p>
          </div>

          <button
            onClick={dismissError}
            className="p-1 rounded-lg text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 shrink-0"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
