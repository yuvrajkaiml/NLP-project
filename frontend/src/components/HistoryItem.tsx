import React from 'react';
import { ArrowRight, Trash2, Copy, Check } from 'lucide-react';
import type { HistoryItem as HistoryItemType } from '../types';
import { formatRelativeTime } from '../utils/helpers';
import { useClipboard } from '../hooks/useClipboard';

interface HistoryItemProps {
  item: HistoryItemType;
  onSelect: (item: HistoryItemType) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onSelect,
  onDelete,
}) => {
  const { copied, copy } = useClipboard();

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative p-3.5 rounded-xl border border-ink-100 dark:border-ink-800 bg-surface-raised dark:bg-surface-dark-raised hover:border-saffron-300 dark:hover:border-saffron-700/60 shadow-soft hover:shadow-lift transition-all duration-200 cursor-pointer text-left"
    >
      <div className="flex items-center justify-between text-[11px] text-ink-400 dark:text-ink-500 mb-1.5">
        <div className="flex items-center space-x-1.5 font-medium">
          <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[10px]">
            {item.source_lang}
          </span>
          <ArrowRight className="w-3 h-3 text-ink-400" />
          <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[10px]">
            {item.target_lang}
          </span>
        </div>

        <span>{formatRelativeTime(item.timestamp)}</span>
      </div>

      <p className="text-xs font-medium text-ink-800 dark:text-ink-200 line-clamp-2 mb-1">
        {item.original_text}
      </p>

      <p className="text-xs text-saffron-600 dark:text-saffron-400 font-semibold line-clamp-2">
        {item.translated_text}
      </p>

      {/* Hover action bar */}
      <div className="mt-2.5 pt-2 flex items-center justify-end space-x-2 border-t border-ink-100 dark:border-ink-800/60 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            copy(item.translated_text);
          }}
          className="p-1 rounded text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
          title="Copy translation"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={(e) => onDelete(item.id, e)}
          className="p-1 rounded text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          title="Delete this history entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
