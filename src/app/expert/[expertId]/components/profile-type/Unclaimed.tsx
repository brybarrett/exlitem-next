'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function Unclaimed() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Alert
      variant='default'
      className='border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50'
    >
      <AlertCircle className='h-4 w-4 text-yellow-600 dark:text-yellow-500' />
      <AlertDescription className='space-y-4 text-sm text-yellow-800 dark:text-yellow-200'>
        <div>
          This page is based on public court records and official sources. It
          was not created or endorsed by the expert, and Exlitem does not
          represent them. This is not a paid advertisement.
        </div>

        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
            className='ml-2 h-auto p-0 text-yellow-700 hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-200'
          >
            <span className='text-xs font-medium'>
              {isExpanded ? 'See Less' : 'See More'}
            </span>
            {isExpanded ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className='space-y-4 border-t border-yellow-200 pt-2 dark:border-yellow-800'>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500' />
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    About This Profile
                  </h4>
                  <p className='text-sm text-yellow-700 dark:text-yellow-300'>
                    This expert profile is automatically generated from publicly
                    available information including court records, professional
                    directories, and official databases. The information is
                    regularly updated but may not reflect the most current
                    status.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500' />
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    Data Sources
                  </h4>
                  <ul className='space-y-1 text-sm text-yellow-700 dark:text-yellow-300'>
                    <li>• State and federal court records</li>
                    <li>• Professional licensing boards</li>
                    <li>• Academic and professional directories</li>
                    <li>• Published legal opinions and cases</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='border-t border-yellow-200 pt-2 dark:border-yellow-800'>
              <h4 className='mb-3 text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                Action Items
              </h4>
              <div className='space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full justify-start border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                >
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Verify Information with Expert
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full justify-start border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                >
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Request Profile Update
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full justify-start border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                >
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Report Inaccurate Information
                </Button>
              </div>
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
