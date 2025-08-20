import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        404
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>
        Something&apos;s missing
      </h2>
      <p>
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className='mt-8 flex justify-center gap-2'>
        <Link href='/'>
          <Button variant='default' size='lg'>
            Go Home
          </Button>
        </Link>
        <Link href='/directory'>
          <Button variant='ghost' size='lg'>
            Browse Experts
          </Button>
        </Link>
      </div>
    </div>
  );
}
