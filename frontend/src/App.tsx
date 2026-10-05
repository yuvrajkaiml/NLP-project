import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { TranslationPanel } from './components/TranslationPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { ErrorToast } from './components/ErrorToast';
import { Sparkles, Globe2, ShieldCheck, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Editorial Hero Section */}
        <section className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3.5 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 border border-saffron-200/60 dark:border-saffron-800/40 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500 animate-pulse" />
            <span>Next-Gen Indic Neural NLP Pipeline</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ink-950 dark:text-white">
            Translate Hinglish <span className="text-saffron-500">↔</span> English
          </h1>

          <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 font-normal">
            Instantly. Accurately. Beautifully.
          </p>

          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 max-w-lg mx-auto">
            Code-mixed Romanized Hindi transliterated to Devanagari, translated with confidence scoring, and enhanced with live audio synthesis.
          </p>
        </section>

        {/* Translation Interactive Panel */}
        <TranslationPanel />

        {/* Value Proposition Highlights */}
        <section className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl glass-panel card-lift flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-saffron-100 dark:bg-saffron-950/80 text-saffron-600 dark:text-saffron-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 dark:text-white">Sub-50ms Response</h4>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
                In-memory multi-tiered LRU caching and asynchronous FastAPI backend.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel card-lift flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-saffron-100 dark:bg-saffron-950/80 text-saffron-600 dark:text-saffron-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 dark:text-white">Full Script Flexibility</h4>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
                Effortlessly handles Romanized chat slang, formal Devanagari, and English.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel card-lift flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-saffron-100 dark:bg-saffron-950/80 text-saffron-600 dark:text-saffron-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 dark:text-white">Confidence Scoring</h4>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
                Transparent probability metrics to ensure nuance and grammatical fidelity.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-ink-100 dark:border-ink-800 py-6 px-4 text-center text-xs text-ink-500 dark:text-ink-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center space-x-1">
            <span>HinglishFlow &copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span>Ink & Saffron Edition</span>
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
            >
              Interactive API Docs (/docs)
            </a>
            <a
              href="http://localhost:8000/api/v1/health"
              target="_blank"
              rel="noreferrer"
              className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
            >
              System Health
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <HistorySidebar />
      <ErrorToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
