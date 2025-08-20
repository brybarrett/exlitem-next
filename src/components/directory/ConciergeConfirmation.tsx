'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';

interface ConciergeConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string;
}

export function ConciergeConfirmation({
  isOpen,
  onClose,
  requestId = 'CC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}: ConciergeConfirmationProps) {
  const nextSteps = [
    {
      step: '1',
      title: 'Requirements Review',
      description:
        'Our expert search team will review your requirements within 2 hours',
      timeframe: 'Within 2 hours'
    },
    {
      step: '2',
      title: 'Expert Research & Vetting',
      description:
        'We identify and vet potential matches from our exclusive network',
      timeframe: '1-2 business days'
    },
    {
      step: '3',
      title: 'Personalized Recommendations',
      description:
        'Receive 3-5 carefully selected expert profiles with detailed analysis',
      timeframe: '3-5 business days'
    },
    {
      step: '4',
      title: 'Expert Introduction',
      description: 'We facilitate introductions with your preferred expert(s)',
      timeframe: 'Same day as selection'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-screen max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500'>
              <CheckCircle className='h-6 w-6 text-white' />
            </div>
            <div>
              <DialogTitle className='text-2xl font-bold text-green-800 dark:text-green-200'>
                Request Submitted Successfully!
              </DialogTitle>
              <p className='text-gray-600 dark:text-gray-400'>
                Your expert search request has been received
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Request Details */}
          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-900'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                  Request Reference
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Save this for your records
                </p>
              </div>
              <Badge variant='outline' className='px-3 py-1 font-mono text-lg'>
                {requestId}
              </Badge>
            </div>
          </div>

          {/* What Happens Next */}
          <div>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
              <Calendar className='h-5 w-5 text-amber-600' />
              What Happens Next
            </h3>
            <div className='space-y-4'>
              {nextSteps.map((step, index) => (
                <div key={index} className='flex items-start gap-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white'>
                    {step.step}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>{step.title}</h4>
                      <Badge variant='outline' className='text-xs'>
                        {step.timeframe}
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Immediate Confirmation */}
          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <div className='mb-2 flex items-center gap-3'>
              <Mail className='h-5 w-5 text-amber-600' />
              <h3 className='font-semibold text-amber-800 dark:text-amber-200'>
                Confirmation Email Sent
              </h3>
            </div>
            <p className='text-sm text-amber-700 dark:text-amber-300'>
              You'll receive a confirmation email within the next few minutes
              with your request details and our team's contact information.
            </p>
          </div>

          {/* Key Benefits Reminder */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>
              Your Concierge Service Includes:
            </h3>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-green-600' />
                <span className='text-sm'>Thoroughly vetted experts</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-green-600' />
                <span className='text-sm'>Exclusive network access</span>
              </div>
              <div className='flex items-center gap-2'>
                <Star className='h-4 w-4 text-green-600' />
                <span className='text-sm'>Personalized matching</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <span className='text-sm'>Facilitation fee only</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20'>
            <h3 className='mb-2 font-semibold text-blue-800 dark:text-blue-200'>
              Questions? We're Here to Help
            </h3>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
                <Mail className='h-4 w-4' />
                <span>concierge@exlitem.com</span>
              </div>
              <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
                <Phone className='h-4 w-4' />
                <span>(555) 123-4567</span>
              </div>
              <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
                <Clock className='h-4 w-4' />
                <span>Monday - Friday, 8 AM - 6 PM EST</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-4'>
            <Button variant='outline' onClick={onClose}>
              Continue Browsing Directory
            </Button>
            <div className='flex gap-3'>
              <Button variant='outline'>Track Request Status</Button>
              <Button className='bg-amber-500 text-white hover:bg-amber-600'>
                View Email Confirmation
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
