import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock } from 'lucide-react';
import { getConfidenceColor } from '../utils/helpers';

interface ConfidenceMeterProps {
  confidence?: number | null;
  processingTimeMs?: number | null;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  processingTimeMs,
}) => {
  if (confidence === undefined || confidence === null) return null;

  const percentage = Math.round(confidence * 100);
  const { bar, text, label } = getConfidenceColor(confidence);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-ink-100 dark:border-ink-800/80">
      {/* Progress & Percentage */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${text}`} />
          <span className="text-xs font-semibold text-ink-700 dark:text-ink-300">
            Confidence:
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-28 sm:w-36 h-2 bg-ink-200/70 dark:bg-ink-800 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${bar}`}
          />
        </div>

        <span className={`text-xs font-bold font-mono ${text}`}>
          {percentage}%
        </span>
        <span className="hidden md:inline text-[11px] text-ink-400 dark:text-ink-500">
          ({label})
        </span>
      </div>

      {/* Latency / Speed Indicator */}
      {processingTimeMs !== undefined && processingTimeMs !== null && (
        <div className="flex items-center space-x-1 text-[11px] text-ink-500 dark:text-ink-400 font-mono self-end sm:self-auto">
          <Clock className="w-3 h-3 text-ink-400" />
          <span>{processingTimeMs}ms</span>
        </div>
      )}
    </div>
  );
};
