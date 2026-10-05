import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { LanguageCode, TranslationData, HistoryItem } from '../types';
import { translateAPI } from '../services/api';

interface State {
  inputText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  translation: TranslationData | null;
  isLoading: boolean;
  error: string | null;
  isHistoryOpen: boolean;
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'SET_INPUT_TEXT'; payload: string }
  | { type: 'SET_SOURCE_LANG'; payload: LanguageCode }
  | { type: 'SET_TARGET_LANG'; payload: LanguageCode }
  | { type: 'SWAP_LANGUAGES' }
  | { type: 'TRANSLATE_START' }
  | { type: 'TRANSLATE_SUCCESS'; payload: TranslationData }
  | { type: 'TRANSLATE_FAILURE'; payload: string }
  | { type: 'CLEAR_TRANSLATION' }
  | { type: 'SET_HISTORY_OPEN'; payload: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOAD_HISTORY_ITEM'; payload: HistoryItem };

const initialState: State = {
  inputText: '',
  sourceLang: 'auto',
  targetLang: 'en',
  translation: null,
  isLoading: false,
  error: null,
  isHistoryOpen: false,
  theme: (typeof window !== 'undefined' && localStorage.getItem('hinglish_theme') === 'dark') ? 'dark' : 'light',
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.payload };

    case 'SET_SOURCE_LANG':
      return { ...state, sourceLang: action.payload };

    case 'SET_TARGET_LANG':
      return { ...state, targetLang: action.payload };

    case 'SWAP_LANGUAGES': {
      const newSource = state.sourceLang === 'auto' ? (state.translation?.detected_language as LanguageCode || 'hinglish') : state.targetLang;
      const newTarget = state.sourceLang === 'auto' ? 'en' : state.sourceLang;
      const swappedText = state.translation?.translated_text || '';
      return {
        ...state,
        sourceLang: newSource,
        targetLang: newTarget,
        inputText: swappedText,
        translation: null,
      };
    }

    case 'TRANSLATE_START':
      return { ...state, isLoading: true, error: null };

    case 'TRANSLATE_SUCCESS':
      return { ...state, isLoading: false, translation: action.payload, error: null };

    case 'TRANSLATE_FAILURE':
      return { ...state, isLoading: false, error: action.payload };

    case 'CLEAR_TRANSLATION':
      return { ...state, inputText: '', translation: null, error: null };

    case 'SET_HISTORY_OPEN':
      return { ...state, isHistoryOpen: action.payload };

    case 'TOGGLE_THEME': {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('hinglish_theme', nextTheme);
      return { ...state, theme: nextTheme };
    }

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'LOAD_HISTORY_ITEM':
      return {
        ...state,
        inputText: action.payload.original_text,
        sourceLang: (action.payload.source_lang as LanguageCode) || 'auto',
        targetLang: (action.payload.target_lang as LanguageCode) || 'en',
        translation: {
          original_text: action.payload.original_text,
          detected_language: action.payload.detected_lang || action.payload.source_lang,
          transliterated_text: action.payload.transliterated_text,
          translated_text: action.payload.translated_text,
          confidence: action.payload.confidence,
          processing_time_ms: action.payload.processing_time_ms || 120,
          word_count: {
            input: action.payload.original_text.split(/\s+/).filter(Boolean).length,
            output: action.payload.translated_text.split(/\s+/).filter(Boolean).length,
          },
        },
        isHistoryOpen: false,
      };

    default:
      return state;
  }
}

interface AppContextType extends State {
  setInputText: (text: string) => void;
  setSourceLang: (lang: LanguageCode) => void;
  setTargetLang: (lang: LanguageCode) => void;
  swapLanguages: () => void;
  translate: (textOverride?: string) => Promise<void>;
  clearInput: () => void;
  setHistoryOpen: (open: boolean) => void;
  toggleTheme: () => void;
  dismissError: () => void;
  loadHistoryItem: (item: HistoryItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const setInputText = useCallback((text: string) => {
    dispatch({ type: 'SET_INPUT_TEXT', payload: text });
  }, []);

  const setSourceLang = useCallback((lang: LanguageCode) => {
    dispatch({ type: 'SET_SOURCE_LANG', payload: lang });
  }, []);

  const setTargetLang = useCallback((lang: LanguageCode) => {
    dispatch({ type: 'SET_TARGET_LANG', payload: lang });
  }, []);

  const swapLanguages = useCallback(() => {
    dispatch({ type: 'SWAP_LANGUAGES' });
  }, []);

  const clearInput = useCallback(() => {
    dispatch({ type: 'CLEAR_TRANSLATION' });
  }, []);

  const setHistoryOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_HISTORY_OPEN', payload: open });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const dismissError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const loadHistoryItem = useCallback((item: HistoryItem) => {
    dispatch({ type: 'LOAD_HISTORY_ITEM', payload: item });
  }, []);

  const translate = useCallback(async (textOverride?: string) => {
    const textToTranslate = (textOverride !== undefined ? textOverride : state.inputText).trim();
    if (!textToTranslate) return;

    dispatch({ type: 'TRANSLATE_START' });

    try {
      const response = await translateAPI.translate(
        textToTranslate,
        state.sourceLang,
        state.targetLang
      );
      if (response && response.success && response.data) {
        dispatch({ type: 'TRANSLATE_SUCCESS', payload: response.data });
      } else {
        dispatch({ type: 'TRANSLATE_FAILURE', payload: 'Translation failed. Please try again.' });
      }
    } catch (err: any) {
      dispatch({ type: 'TRANSLATE_FAILURE', payload: err.message || 'Translation error' });
    }
  }, [state.inputText, state.sourceLang, state.targetLang]);

  const value = {
    ...state,
    setInputText,
    setSourceLang,
    setTargetLang,
    swapLanguages,
    translate,
    clearInput,
    setHistoryOpen,
    toggleTheme,
    dismissError,
    loadHistoryItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
