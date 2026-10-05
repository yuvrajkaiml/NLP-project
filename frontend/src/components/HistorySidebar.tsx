import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Search, History as HistoryIcon, AlertCircle } from 'lucide-react';
import type { HistoryItem as HistoryItemType } from '../types';
import { HistoryItem } from './HistoryItem';
import { translateAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export const HistorySidebar: React.FC = () => {
  const { isHistoryOpen, setHistoryOpen, loadHistoryItem, translation } = useApp();
  const [historyList, setHistoryList] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await translateAPI.getHistory(1, 50);
      if (res && res.success && res.data) {
        setHistoryList(res.data);
        localStorage.setItem('hinglish_history', JSON.stringify(res.data));
      }
    } catch {
      // Fallback to local storage if offline
      const stored = localStorage.getItem('hinglish_history');
      if (stored) {
        try {
          setHistoryList(JSON.parse(stored));
        } catch {
          setHistoryList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen, fetchHistory, translation]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await translateAPI.deleteHistoryItem(id);
    } catch {
      // Ignore network errors on delete
    }
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem('hinglish_history', JSON.stringify(updated));
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all translation history?')) return;
    try {
      await translateAPI.clearHistory();
    } catch {
      // Continue clearing local state
    }
    setHistoryList([]);
    localStorage.removeItem('hinglish_history');
  };

  const filteredItems = historyList.filter(
    (item) =>
      item.original_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translated_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isHistoryOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHistoryOpen(false)}
            className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm"
          />

          {/* Slide-in Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface-raised dark:bg-surface-dark-raised border-l border-ink-100 dark:border-ink-800 shadow-lift flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-saffron-100 dark:bg-saffron-950/60 text-saffron-600 dark:text-saffron-400">
                  <HistoryIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-ink-900 dark:text-white">
                    Translation History
                  </h3>
                  <p className="text-[11px] text-ink-400">
                    {historyList.length} past {historyList.length === 1 ? 'translation' : 'translations'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {historyList.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-2 rounded-lg text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Clear All History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setHistoryOpen(false)}
                  className="p-2 rounded-lg text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            {historyList.length > 0 && (
              <div className="p-3.5 border-b border-ink-100 dark:border-ink-800/60">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search history..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-surface-sunken dark:bg-surface-dark-sunken border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* History List Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && historyList.length === 0 ? (
                <div className="py-12 text-center text-xs text-ink-400 animate-pulse">
                  Loading history...
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onSelect={loadHistoryItem}
                    onDelete={handleDeleteItem}
                  />
                ))
              ) : (
                <div className="py-16 text-center text-ink-400 flex flex-col items-center justify-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-ink-300 dark:text-ink-700" />
                  <p className="text-sm font-medium text-ink-600 dark:text-ink-400">
                    {searchQuery ? 'No matching translations' : 'No translation history yet'}
                  </p>
                  <p className="text-xs text-ink-400 dark:text-ink-500 max-w-xs">
                    Your translations will automatically appear here for quick access.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
