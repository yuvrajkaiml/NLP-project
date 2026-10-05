import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, Share2, Trash2 } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface ActionBarProps {
  textToCopy: string;
  textToSpeak: string;
  speakLang?: string;
  onClear: () => void;
  hasContent: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  textToCopy,
  textToSpeak,
  speakLang = 'en',
  onClear,
  hasContent,
}) => {
  const { copied, copy } = useClipboard();
  const { speak, stop, isPlaying, isSupported: ttsSupported } = useTextToSpeech();
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    if (!textToCopy) return;
    copy(textToCopy);
  };

  const handleSpeak = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(textToSpeak, speakLang);
    }
  };

  const handleShare = async () => {
    if (!textToCopy) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HinglishFlow Translation',
          text: textToCopy,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy
        copy(textToCopy);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      copy(textToCopy);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        disabled={!hasContent}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          copied
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
            : hasContent
            ? 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
            : 'text-ink-300 dark:text-ink-700 cursor-not-allowed'
        }`}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {/* TTS Listen Button */}
      {ttsSupported && (
        <button
          type="button"
          onClick={handleSpeak}
          disabled={!hasContent}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 border border-saffron-300 dark:border-saffron-700 animate-pulse'
              : hasContent
              ? 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
              : 'text-ink-300 dark:text-ink-700 cursor-not-allowed'
          }`}
          title={isPlaying ? 'Stop listening' : 'Listen with Text-to-Speech'}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5 text-saffron-600" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Listen'}</span>
        </button>
      )}

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        disabled={!hasContent}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          shared
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
            : hasContent
            ? 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
            : 'text-ink-300 dark:text-ink-700 cursor-not-allowed'
        }`}
        title="Share translation"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{shared ? 'Link Copied' : 'Share'}</span>
      </button>

      {/* Clear Button */}
      <button
        type="button"
        onClick={onClear}
        disabled={!hasContent}
        className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
          hasContent
            ? 'text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            : 'text-ink-200 dark:text-ink-800 cursor-not-allowed'
        }`}
        title="Clear text"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
