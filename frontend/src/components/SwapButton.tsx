import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onSwap, disabled = false }) => {
  const [rotation, setRotation] = React.useState(0);

  const handleClick = () => {
    if (disabled) return;
    setRotation((prev) => prev + 180);
    onSwap();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      animate={{ rotate: rotation }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`p-2.5 rounded-full border shadow-soft transition-colors duration-200 ${
        disabled
          ? 'bg-ink-100 dark:bg-ink-800 text-ink-300 dark:text-ink-600 border-ink-200 dark:border-ink-800 cursor-not-allowed'
          : 'bg-surface-raised dark:bg-surface-dark-raised text-ink-700 dark:text-ink-200 hover:text-saffron-500 hover:border-saffron-300 dark:hover:border-saffron-500/50 border-ink-200 dark:border-ink-700'
      }`}
      aria-label="Swap source and target languages"
      title="Swap languages"
    >
      <ArrowLeftRight className="w-4 h-4" />
    </motion.button>
  );
};
