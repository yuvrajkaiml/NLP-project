import React, { useState } from 'react';
import { History, Moon, Sun, HelpCircle, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { isHistoryOpen, setHistoryOpen, theme, toggleTheme } = useApp();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-ink-100/60 dark:border-ink-800/60 transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-ink-900 to-ink-950 dark:from-ink-800 dark:to-ink-950 flex items-center justify-center shadow-soft border border-ink-800 group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <div className="absolute inset-0 bg-saffron-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-hindi font-bold text-saffron-400 text-xl leading-none">अ</span>
              <span className="font-display font-bold text-white text-xl leading-none -ml-1">A</span>
              <div className="absolute -bottom-1 w-6 h-1 bg-saffron-500 rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-ink-900 dark:text-white">
                  Hinglish<span className="text-saffron-500">Flow</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-saffron-100 dark:bg-saffron-950/80 text-saffron-700 dark:text-saffron-300 border border-saffron-200/50 dark:border-saffron-800/40">
                  NLP v1.0
                </span>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-400 font-medium hidden sm:block">
                Hindi ↔ English Code-Mixed Translation Engine
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Help / About Button */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800/60 transition-colors"
              aria-label="About HinglishFlow"
              title="About & Examples"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800/60 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-saffron-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* History Toggle Button */}
            <button
              onClick={() => setHistoryOpen(!isHistoryOpen)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isHistoryOpen
                  ? 'bg-saffron-500 text-white shadow-glow'
                  : 'bg-surface-raised dark:bg-ink-800/80 text-ink-800 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700/80 border border-ink-200/60 dark:border-ink-700/60'
              }`}
              aria-label="Toggle Translation History"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* About & Instructions Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-raised dark:bg-surface-dark-raised border border-ink-200 dark:border-ink-800 rounded-2xl max-w-lg w-full p-6 shadow-lift relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl saffron-gradient flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-900 dark:text-white">About HinglishFlow</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">4-Stage Code-Mixed Neural NLP Pipeline</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-ink-600 dark:text-ink-300">
              <p>
                HinglishFlow bridges the gap between conversational Romanized Hindi (Hinglish), formal Devanagari Hindi, and modern English.
              </p>

              <div className="p-3.5 rounded-xl bg-surface-sunken dark:bg-surface-dark-sunken border border-ink-100 dark:border-ink-800/80 space-y-2">
                <p className="font-semibold text-xs tracking-wider uppercase text-ink-500 dark:text-ink-400">Pipeline Stages:</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-saffron-500 shrink-0" />
                    <span><strong>1. Language Detection:</strong> Auto-identifies script & code-mixing ratio.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-saffron-500 shrink-0" />
                    <span><strong>2. Phonetic Transliteration:</strong> Converts Romanized Hindi to Devanagari.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-saffron-500 shrink-0" />
                    <span><strong>3. Neural & Semantic Translation:</strong> Translates with confidence scoring.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-saffron-500 shrink-0" />
                    <span><strong>4. Post-Processor:</strong> Normalizes grammar, punctuation, and casing.</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-ink-500 dark:text-ink-400">
                <p><strong>Keyboard shortcut:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-ink-200 dark:bg-ink-800 font-mono text-[11px] text-ink-800 dark:text-ink-200">Ctrl + Enter</kbd> to translate instantly.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-ink-900 dark:bg-saffron-500 text-white font-medium hover:bg-ink-800 dark:hover:bg-saffron-600 transition-colors text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
