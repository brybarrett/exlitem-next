'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ExpandableTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ExpandableTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ExpandableTextareaProps
>(({ className, ...props }, ref) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Use the forwarded ref or our internal ref
  const combinedRef = React.useCallback(
    (node: HTMLTextAreaElement) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      textareaRef.current = node;
    },
    [ref]
  );

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsExpanded(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Only collapse if the textarea is empty
    if (!e.target.value.trim()) {
      setIsExpanded(false);
    }
    props.onBlur?.(e);
  };

  const rows = isExpanded ? 4 : 1;

  return (
    <textarea
      className={cn(
        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      rows={rows}
      ref={combinedRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
});
ExpandableTextarea.displayName = 'ExpandableTextarea';

export { ExpandableTextarea };
