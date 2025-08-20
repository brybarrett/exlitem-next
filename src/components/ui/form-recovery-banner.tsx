'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, RefreshCw, Trash2 } from 'lucide-react';

interface FormRecoveryBannerProps {
  onRestore: () => void;
  onDiscard: () => void;
  savedAt: Date;
  className?: string;
}

export function FormRecoveryBanner({
  onRestore,
  onDiscard,
  savedAt,
  className = ''
}: FormRecoveryBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const formatSavedTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleRestore = () => {
    onRestore();
    setIsVisible(false);
  };

  const handleDiscard = () => {
    onDiscard();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Alert
      className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 ${className}`}
    >
      <RefreshCw className='h-4 w-4 text-amber-600 dark:text-amber-400' />
      <AlertDescription className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-amber-800 dark:text-amber-200'>
            We found a saved draft of your form
          </p>
          <p className='text-xs text-amber-700 dark:text-amber-300'>
            Last saved {formatSavedTime(savedAt)}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            size='sm'
            variant='default'
            onClick={handleRestore}
            className='bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600'
          >
            <RefreshCw className='mr-1 h-3 w-3' />
            Restore Draft
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={handleDiscard}
            className='border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900'
          >
            <Trash2 className='mr-1 h-3 w-3' />
            Start Fresh
          </Button>

          <Button
            size='sm'
            variant='ghost'
            onClick={handleDismiss}
            className='text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900'
          >
            <X className='h-3 w-3' />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
