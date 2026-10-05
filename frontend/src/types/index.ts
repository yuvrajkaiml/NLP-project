export type LanguageCode = 'auto' | 'hinglish' | 'en' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  native_name: string;
  flag: string;
}

export interface WordCount {
  input: number;
  output: number;
}

export interface TranslationData {
  original_text: string;
  detected_language: LanguageCode | string;
  transliterated_text?: string | null;
  translated_text: string;
  confidence?: number | null;
  processing_time_ms: number;
  word_count: WordCount;
}

export interface TranslationResponse {
  success: boolean;
  data: TranslationData;
}

export interface HistoryItem {
  id: string;
  original_text: string;
  transliterated_text?: string | null;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  detected_lang?: string | null;
  confidence?: number | null;
  processing_time_ms?: number | null;
  timestamp: string;
}

export interface HistoryResponse {
  success: boolean;
  data: HistoryItem[];
  total: number;
  page: number;
  per_page: number;
}
