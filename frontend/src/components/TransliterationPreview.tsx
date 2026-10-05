import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

interface TransliterationPreviewProps {
  transliteratedText?: string | null;
  detectedLanguage?: string;
}

export const TransliterationPreview: React.FC<TransliterationPreviewProps> = ({
  transliteratedText,
  detectedLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { copied, copy } = useClipboard();

  if (!transliteratedText || detectedLanguage === 'hi') {
    return null;
  }

  return (
    <div className="my-3 rounded-xl border border-saffron-200/80 dark:border-saffron-900/40 bg-saffron-50/50 dark:bg-saffron-950/20 overflow-hidden transition-all duration-200">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3.5 py-2 cursor-pointer select-none text-xs font-medium text-saffron-800 dark:text-saffron-300 hover:bg-saffron-100/50 dark:hover:bg-saffron-900/30 transition-colors"
      >
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
          <span className="font-semibold tracking-wide uppercase text-[11px]">
            Phonetic Transliteration (Devanagari)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isOpen && (
        <div className="px-3.5 pb-3 pt-1 flex items-start justify-between gap-3 border-t border-saffron-100 dark:border-saffron-900/30">
          <p className="font-hindi text-base sm:text-lg text-ink-900 dark:text-ink-100 leading-relaxed">
            {transliteratedText}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copy(transliteratedText);
            }}
            className="p-1.5 rounded-lg text-ink-500 hover:text-saffron-600 dark:text-ink-400 dark:hover:text-saffron-400 hover:bg-saffron-100/60 dark:hover:bg-saffron-900/40 transition-colors shrink-0"
            title="Copy Devanagari text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
