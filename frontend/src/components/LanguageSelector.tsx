import React from 'react';
import type { LanguageCode, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES } from '../utils/constants';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  isTarget?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onChange,
  isTarget = false,
}) => {
  const options: LanguageOption[] = isTarget ? TARGET_LANGUAGES : SUPPORTED_LANGUAGES;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-surface-sunken dark:bg-surface-dark-sunken rounded-xl border border-ink-100 dark:border-ink-800/80 overflow-x-auto no-scrollbar">
      {options.map((opt) => {
        const isActive = currentLang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange(opt.code)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
              isActive
                ? 'bg-surface-raised dark:bg-ink-800 text-saffron-600 dark:text-saffron-400 font-semibold shadow-soft border border-saffron-200/60 dark:border-saffron-500/30'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 hover:bg-surface-raised/50 dark:hover:bg-ink-800/50'
            }`}
          >
            <span>{opt.flag}</span>
            <span>{opt.name}</span>
          </button>
        );
      })}
    </div>
  );
};
