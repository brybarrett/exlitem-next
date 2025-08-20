'use client';

import { useEffect, useState } from 'react';
import { Check, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isSaving?: boolean;
  lastSavedAt?: Date | null;
  className?: string;
}

export function AutoSaveIndicator({
  isSaving = false,
  lastSavedAt = null,
  className = ''
}: AutoSaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSavedAt) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSavedAt]);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 30) return 'just now';
    if (diffMins < 1) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSaving) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex items-center gap-2 text-sm',
          className
        )}
      >
        <Save className='h-3 w-3 animate-pulse' />
        <span>Saving...</span>
      </div>
    );
  }

  if (showSaved && lastSavedAt) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-green-600 dark:text-green-400',
          className
        )}
      >
        <Check className='h-3 w-3' />
        <span>Saved</span>
      </div>
    );
  }

  if (lastSavedAt) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex items-center gap-2 text-sm',
          className
        )}
      >
        <Clock className='h-3 w-3' />
        <span>Saved {formatLastSaved(lastSavedAt)}</span>
      </div>
    );
  }

  return null;
}
