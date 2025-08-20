'use client';

import { IconBrightness } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export function ColorModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      // const root = document.documentElement;

      setTheme(newMode);
      // if (!document.startViewTransition) {
      //   return;
      // }

      // Set coordinates from the click event
      // if (e) {
      //   root.style.setProperty('--x', `${e.clientX}px`);
      //   root.style.setProperty('--y', `${e.clientY}px`);
      // }

      // document.startViewTransition(() => {
      //   setTheme(newMode);
      // });
    },
    [resolvedTheme, setTheme]
  );

  // Add keyboard shortcut for theme toggle
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for 't' key press
      if (event.key === 't' && event.ctrlKey) {
        event.preventDefault();
        handleThemeToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleThemeToggle]);

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-9 w-9 p-0'
      onClick={handleThemeToggle}
    >
      <IconBrightness />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
