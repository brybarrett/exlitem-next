'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AddExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSameCase: () => void;
  onNewCase: () => void;
  currentRequestId: string;
}

export function AddExpertModal({
  isOpen,
  onClose,
  onSameCase,
  onNewCase,
  currentRequestId
}: AddExpertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='mx-4 max-w-4xl overflow-hidden p-0 sm:mx-6'>
        {/* Header with gradient background */}
        <div className='relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 dark:from-blue-950/30 dark:to-indigo-950/30'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent dark:from-blue-900/20' />
          <DialogHeader className='relative'>
            <div className='flex items-center gap-4'>
              <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500 shadow-lg dark:bg-blue-600'>
                <Plus className='h-7 w-7 text-white' />
              </div>
              <div className='flex-1'>
                <DialogTitle className='mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  Add Another Expert Request
                </DialogTitle>
                <p className='text-base text-gray-600 dark:text-gray-300'>
                  Choose how you'd like to proceed with your next expert search
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content area with proper margins */}
        <div className='p-6 sm:p-8'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Same Case Option */}
            <Card
              className='group cursor-pointer border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:shadow-xl dark:border-blue-800 dark:from-blue-950/30 dark:to-indigo-950/30 dark:hover:border-blue-600'
              onClick={onSameCase}
            >
              <CardContent className='relative overflow-hidden p-6'>
                {/* Background decoration */}
                <div className='absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-blue-500/5' />

                <div className='relative space-y-5'>
                  {/* Header with icon and badge */}
                  <div className='flex items-center justify-between'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-blue-600'>
                      <FileText className='h-8 w-8 text-white' />
                    </div>
                    <Badge
                      variant='secondary'
                      className='bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    >
                      <Sparkles className='mr-1 h-3 w-3' />
                      Recommended
                    </Badge>
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-gray-100'>
                      Same Case
                    </h3>
                    <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                      Add another expert to your existing case with pre-filled
                      details
                    </p>
                  </div>

                  {/* Benefits list */}
                  <div className='space-y-3 py-2'>
                    <div className='flex items-center gap-3 text-sm text-green-600 dark:text-green-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                        <CheckCircle className='h-3 w-3' />
                      </div>
                      <span>Case details pre-filled</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-green-600 dark:text-green-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                        <Clock className='h-3 w-3' />
                      </div>
                      <span>Faster setup process</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-green-600 dark:text-green-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                        <User className='h-3 w-3' />
                      </div>
                      <span>Contact info preserved</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    className='mt-4 w-full bg-blue-500 font-medium text-white shadow-lg transition-all duration-300 group-hover:shadow-xl hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                    size='lg'
                  >
                    Continue with Same Case
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* New Case Option */}
            <Card
              className='group cursor-pointer border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-green-50/50 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-xl dark:border-emerald-800 dark:from-emerald-950/30 dark:to-green-950/30 dark:hover:border-emerald-600'
              onClick={onNewCase}
            >
              <CardContent className='relative overflow-hidden p-6'>
                {/* Background decoration */}
                <div className='absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-emerald-500/5' />

                <div className='relative space-y-5'>
                  {/* Header with icon */}
                  <div className='flex items-center justify-between'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-600'>
                      <Plus className='h-8 w-8 text-white' />
                    </div>
                    <div className='h-6 w-6' /> {/* Spacer for alignment */}
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-gray-100'>
                      New Case
                    </h3>
                    <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                      Start fresh with a completely new expert search request
                    </p>
                  </div>

                  {/* Benefits list */}
                  <div className='space-y-3 py-2'>
                    <div className='flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
                        <FileText className='h-3 w-3' />
                      </div>
                      <span>Fresh case details</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
                        <Plus className='h-3 w-3' />
                      </div>
                      <span>New requirements</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-green-600 dark:text-green-400'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                        <User className='h-3 w-3' />
                      </div>
                      <span>Contact info preserved</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    className='mt-4 w-full bg-emerald-500 font-medium text-white shadow-lg transition-all duration-300 group-hover:shadow-xl hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                    size='lg'
                  >
                    Start New Case
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Reference Info and Actions */}
          <div className='mt-8 border-t border-gray-200 pt-6 dark:border-gray-700'>
            {/* Reference Info */}
            <div className='mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
              <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>
                  <FileText className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                </div>
                <div>
                  <span className='text-gray-500 dark:text-gray-400'>
                    Current request reference:
                  </span>
                  <div className='mt-1 font-mono font-semibold text-gray-900 dark:text-gray-100'>
                    {currentRequestId}
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className='flex justify-center'>
              <Button
                variant='outline'
                onClick={onClose}
                className='border-gray-300 px-8 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                size='lg'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
