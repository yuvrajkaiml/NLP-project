export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 5) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getConfidenceColor(score: number): { bar: string; text: string; label: string } {
  if (score >= 0.90) {
    return {
      bar: 'from-emerald-500 to-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      label: 'High Confidence'
    };
  }
  if (score >= 0.75) {
    return {
      bar: 'from-saffron-500 to-saffron-400',
      text: 'text-saffron-600 dark:text-saffron-400',
      label: 'Good Confidence'
    };
  }
  return {
    bar: 'from-amber-500 to-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    label: 'Moderate Confidence'
  };
}
