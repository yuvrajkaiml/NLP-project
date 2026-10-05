import { useState, useCallback, useEffect } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: string = 'en') => {
      if (!isSupported || !text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Determine speech language code
      if (lang === 'hi' || /[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }

      // Try selecting suitable voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith(utterance.lang.slice(0, 2))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  return { speak, stop, isPlaying, isSupported };
}
