import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface AboutSectionProps {
  bio: string | null;
  expert?: any;
}

export function AboutSection({ bio, expert }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-semibold'>About</CardTitle>
        {/* <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit About</span>
        </Button> */}
      </CardHeader>
      <CardContent>
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <div className='relative'>
            <div className={`${!isExpanded ? 'line-clamp-[3]' : ''}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: bio || 'No biography available.'
                }}
              />
            </div>
            {bio && bio.split(' ').length > 50 && (
              <Button
                variant='ghost'
                className='text-primary hover:text-primary/90 mt-2'
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls='expert-bio'
              >
                {isExpanded ? 'See Less' : 'See More'}
              </Button>
            )}
          </div>
          <div className='sr-only' aria-hidden='true'>
            {bio || 'No biography available.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
