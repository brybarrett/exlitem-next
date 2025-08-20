'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoBrandProps {
  isDarkMode?: 'dark' | 'light';
}

export function LogoBrand({ isDarkMode: isDarkModeProp }: LogoBrandProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const effectiveDarkMode = isDarkModeProp
    ? isDarkModeProp === 'dark'
    : resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, always show light theme logo
  if (!mounted) {
    return (
      <div className='mt-0.5 flex items-center gap-2'>
        <Image
          src='/logo/exlitem-logo.svg'
          height={50}
          width={200}
          className='h-[50px] w-auto p-2.5'
          alt='Logo'
          priority
        />
      </div>
    );
  }

  return (
    <div className='mt-0.5 flex items-center gap-2'>
      <Image
        src={
          effectiveDarkMode
            ? '/logo/exlitem-logo-darkmode.svg'
            : '/logo/exlitem-logo.svg'
        }
        height={50}
        width={200}
        className='h-[50px] w-auto p-2.5'
        alt='Logo'
        priority
      />
    </div>
  );
}

export default LogoBrand;
