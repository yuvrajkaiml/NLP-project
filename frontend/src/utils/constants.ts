import type { LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto-Detect', native_name: 'पहचानें', flag: '🌐' },
  { code: 'hinglish', name: 'Hinglish', native_name: 'Hinglish', flag: '🇮🇳' },
  { code: 'en', name: 'English', native_name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', flag: '🇮🇳' },
];

export const TARGET_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native_name: 'English', flag: '🇬🇧' },
  { code: 'hinglish', name: 'Hinglish', native_name: 'Hinglish', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', flag: '🇮🇳' },
];

export const SAMPLE_PROMPTS = [
  "Mujhe kal college mein presentation dena hai",
  "Yaar wo bahut smart hai",
  "Mera phone kharab ho gaya",
  "Kya tumne khana khaya",
  "Bhai movie dekhne chalte hain",
  "Meri tabiyat theek nahi hai",
  "Wo kal party mein nahi aaya",
  "Tum bahut achhe ho",
  "Mujhe samajh nahi aa raha",
  "Chai peene chalein",
];

export const MAX_INPUT_CHARS = 500;
