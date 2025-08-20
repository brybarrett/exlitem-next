import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export function Claimed({
  isOwner,
  isAdmin
}: {
  isOwner: boolean;
  isAdmin: boolean;
}) {
  return (
    <div>
      <Alert className='mt-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
        <AlertCircle className='h-4 w-4 text-amber-600' />
        <AlertTitle>Profile Claimed - Verification Pending</AlertTitle>
        <AlertDescription className='mt-2'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm'>
              Complete verification to unlock full profile features and
              credibility benefits.
            </p>
            {(isOwner || isAdmin) && (
              <Button variant='default' size='sm'>
                <ShieldCheck className='mr-2 h-4 w-4' />
                Complete Verification
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
