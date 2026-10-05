import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CornerDownLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import { SwapButton } from './SwapButton';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ActionBar } from './ActionBar';
import { TransliterationPreview } from './TransliterationPreview';
import { LoadingSkeleton } from './LoadingSkeleton';
import { SAMPLE_PROMPTS, MAX_INPUT_CHARS } from '../utils/constants';
import { countWords } from '../utils/helpers';

export const TranslationPanel: React.FC = () => {
  const {
    inputText,
    setInputText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    swapLanguages,
    translation,
    isLoading,
    translate,
    clearInput,
  } = useApp();

  // Typewriter effect state for cycling placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  }, [inputText]);

  // Typewriter animation loop
  useEffect(() => {
    if (inputText.length > 0) return;

    const currentPrompt = SAMPLE_PROMPTS[placeholderIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedPlaceholder.length < currentPrompt.length) {
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(currentPrompt.slice(0, displayedPlaceholder.length + 1));
      }, 55);
    } else if (!isDeleting && displayedPlaceholder.length === currentPrompt.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2400);
    } else if (isDeleting && displayedPlaceholder.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(currentPrompt.slice(0, displayedPlaceholder.length - 1));
      }, 25);
    } else if (isDeleting && displayedPlaceholder.length === 0) {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isDeleting, placeholderIndex, inputText]);

  // Handle keyboard shortcut: Ctrl+Enter or Cmd+Enter to translate
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      translate();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    translate(prompt);
  };

  const inputWordCount = countWords(inputText);
  const outputWordCount = translation ? countWords(translation.translated_text) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Translation Main Card */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl border border-ink-100 dark:border-ink-800 shadow-lift overflow-hidden transition-all duration-300">
        
        {/* Language Selection Header */}
        <div className="p-3.5 sm:p-5 border-b border-ink-100 dark:border-ink-800/80 bg-surface-raised/40 dark:bg-surface-dark-raised/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-[11px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider hidden lg:inline">
              From:
            </span>
            <LanguageSelector
              currentLang={sourceLang}
              onChange={setSourceLang}
            />
          </div>

          <div className="flex items-center justify-center self-center">
            <SwapButton
              onSwap={swapLanguages}
              disabled={sourceLang === 'auto'}
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider hidden lg:inline">
              To:
            </span>
            <LanguageSelector
              currentLang={targetLang}
              onChange={setTargetLang}
              isTarget
            />
          </div>
        </div>

        {/* Input & Output Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100 dark:divide-ink-800">
          
          {/* Input Panel */}
          <div className="p-4 sm:p-6 flex flex-col justify-between bg-surface-raised/60 dark:bg-surface-dark-raised/60 relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-ink-400">
                <span className="font-semibold uppercase tracking-wider">
                  Input ({sourceLang === 'auto' ? 'Auto-Detect' : sourceLang})
                </span>
                <span className="font-mono">
                  {inputWordCount} {inputWordCount === 1 ? 'word' : 'words'} | {inputText.length}/{MAX_INPUT_CHARS}
                </span>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_INPUT_CHARS) {
                      setInputText(e.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={displayedPlaceholder || 'Type or paste Hinglish, Hindi, or English sentence...'}
                  rows={4}
                  className="w-full bg-transparent resize-none text-base sm:text-lg text-ink-900 dark:text-white placeholder:text-ink-400/70 dark:placeholder:text-ink-500 focus:outline-none leading-relaxed transition-opacity"
                  aria-label="Input sentence to translate"
                />
              </div>
            </div>

            {/* Input Footer / Quick Action Bar */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-ink-100/80 dark:border-ink-800/60">
              <ActionBar
                textToCopy={inputText}
                textToSpeak={inputText}
                speakLang={sourceLang === 'en' ? 'en' : 'hi'}
                onClear={clearInput}
                hasContent={inputText.length > 0}
              />

              <button
                type="button"
                onClick={() => translate()}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isLoading || !inputText.trim()
                    ? 'bg-ink-100 dark:bg-ink-800 text-ink-400 dark:text-ink-600 cursor-not-allowed'
                    : 'saffron-gradient text-white shadow-soft hover:shadow-glow active:scale-95'
                }`}
                aria-label="Translate sentence"
              >
                <span>Translate</span>
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <CornerDownLeft className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="p-4 sm:p-6 flex flex-col justify-between bg-surface-sunken/40 dark:bg-surface-dark-sunken/40 relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-ink-400">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold uppercase tracking-wider">
                    Translation ({targetLang})
                  </span>
                  {translation?.detected_language && (
                    <span className="px-1.5 py-0.5 rounded bg-saffron-100 dark:bg-saffron-950/80 text-saffron-700 dark:text-saffron-300 font-semibold text-[10px] uppercase">
                      Detected: {translation.detected_language}
                    </span>
                  )}
                </div>
                {translation && (
                  <span className="font-mono">
                    {outputWordCount} {outputWordCount === 1 ? 'word' : 'words'}
                  </span>
                )}
              </div>

              {/* Translation Content Area */}
              <div className="min-h-[140px] flex flex-col justify-center">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : translation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <p
                      className={`text-base sm:text-lg font-medium leading-relaxed ${
                        targetLang === 'hi'
                          ? 'font-hindi text-ink-950 dark:text-white'
                          : 'text-ink-900 dark:text-white'
                      }`}
                    >
                      {translation.translated_text}
                    </p>

                    {/* Transliteration Preview (for Hinglish inputs) */}
                    <TransliterationPreview
                      transliteratedText={translation.transliterated_text}
                      detectedLanguage={translation.detected_language as string}
                    />
                  </motion.div>
                ) : (
                  <div className="py-8 text-center text-ink-400 dark:text-ink-600 flex flex-col items-center justify-center space-y-1">
                    <Sparkles className="w-6 h-6 opacity-40 mb-1" />
                    <p className="text-sm font-medium">Translation will appear here</p>
                    <p className="text-xs opacity-75">Click Translate or press Ctrl + Enter</p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Footer & Confidence Meter */}
            <div className="mt-4 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <ActionBar
                  textToCopy={translation?.translated_text || ''}
                  textToSpeak={translation?.translated_text || ''}
                  speakLang={targetLang === 'hi' ? 'hi' : 'en'}
                  onClear={() => {}}
                  hasContent={Boolean(translation?.translated_text)}
                />

                {translation && (
                  <span className="text-[11px] text-ink-400 font-mono">
                    Processed in {translation.processing_time_ms}ms
                  </span>
                )}
              </div>

              <ConfidenceMeter
                confidence={translation?.confidence}
                processingTimeMs={translation?.processing_time_ms}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Example Chips Carousel */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-saffron-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">
            Try these everyday Hinglish examples:
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-raised dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:text-saffron-600 dark:hover:text-saffron-400 hover:border-saffron-300 dark:hover:border-saffron-500/50 border border-ink-200/80 dark:border-ink-700/80 shadow-soft transition-all duration-150 active:scale-95 text-left"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
