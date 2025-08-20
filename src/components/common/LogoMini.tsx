'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

export function LogoMini() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className='mt-0.5 flex items-center gap-2'>
      <Image
        src={
          isDark ? '/logo/exlitem-logo-mini.svg' : '/logo/exlitem-logo-mini.svg'
        }
        height={50}
        width={200}
        className='h-[40px] w-auto'
        alt='Expert Witness Profiler'
      />
    </div>
  );
}

export default LogoMini;
