import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, EyeOff, Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export function Verified({
  visibilitySettings,
  toggleVisibility,
  isOwner,
  isAdmin,
  isActionLoading
}: any) {
  return (
    <>
      {/* Verified Badge Banner */}
      <div className='mt-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20'>
        <div className='flex items-center gap-3'>
          <CheckCircle className='h-5 w-5 text-green-600' />
          <div>
            <p className='font-medium text-green-900 dark:text-green-100'>
              Verified Expert
            </p>
            <p className='text-sm text-green-700 dark:text-green-300'>
              All credentials have been independently verified
            </p>
          </div>
        </div>
        {(isOwner || isAdmin) && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='sm'>
                <Settings className='mr-2 h-4 w-4' />
                Visibility Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Profile Visibility Settings</SheetTitle>
                <SheetDescription>
                  Control which sections of your profile are visible to visitors
                </SheetDescription>
              </SheetHeader>
              <div className='mt-6 space-y-4 px-4'>
                {visibilitySettings.map((value: any) => (
                  <div
                    key={value.key}
                    className='flex items-center justify-between'
                  >
                    <Label
                      htmlFor={value.key}
                      className='flex items-center gap-2 capitalize'
                    >
                      {value.value ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                      {value.label
                        .replaceAll('_', ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^show /, '')
                        .trim()}
                    </Label>
                    <Switch
                      id={value.key}
                      disabled={isActionLoading}
                      checked={value.value}
                      onCheckedChange={() =>
                        toggleVisibility(value.key, value.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </>
  );
}
