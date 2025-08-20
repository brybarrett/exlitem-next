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
  Users,
  Shield,
  DollarSign,
  ArrowRight,
  Star,
  Target
} from 'lucide-react';

interface SearchConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function SearchConciergeModal({
  isOpen,
  onClose,
  onGetStarted
}: SearchConciergeModalProps) {
  const benefits = [
    {
      icon: Target,
      title: 'Tailored Expert Matching',
      description:
        'Our team personally reviews your case and finds specialists who match your exact requirements'
    },
    {
      icon: Users,
      title: 'Complete Outreach & Coordination',
      description:
        'We handle all initial contact, availability checks, and coordination with potential experts'
    },
    {
      icon: Clock,
      title: 'Time-Saving Process',
      description:
        'Focus on case strategy while we handle research, vetting, and expert coordination'
    },
    {
      icon: Shield,
      title: 'Comprehensive Vetting',
      description:
        'We run thorough availability, suitability, and conflict checks for every recommended expert'
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Share Your Requirements',
      description:
        'Tell us about your case, timeline, and specific expert qualifications needed'
    },
    {
      step: '2',
      title: 'Expert Research & Vetting',
      description:
        'Our team identifies and vets potential matches from our exclusive network'
    },
    {
      step: '3',
      title: 'Personalized Recommendations',
      description:
        'Receive 3-5 carefully selected expert profiles with detailed analysis'
    },
    {
      step: '4',
      title: 'Connect & Retain',
      description:
        'Choose your preferred expert and we facilitate the introduction'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-screen max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500'>
              <Star className='h-6 w-6 text-white' />
            </div>
            <div>
              <DialogTitle className='text-2xl font-bold'>
                Search Concierge Service
              </DialogTitle>
              <p className='text-gray-600 dark:text-gray-400'>
                Let our experts find the perfect match for your case
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-8'>
          {/* Engagement Facilitation Fee Highlight */}
          <div className='rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500'>
                <DollarSign className='h-4 w-4 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-green-800 dark:text-green-200'>
                  Engagement Facilitation Fee Only - No Upfront Cost
                </h3>
                <p className='text-sm text-green-700 dark:text-green-300'>
                  You only pay our facilitation fee when you retain an expert
                  and they agree to the engagement
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>
              Why Choose Our Concierge Service?
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={index}
                    className='flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900'
                  >
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900'>
                      <IconComponent className='h-4 w-4 text-amber-600' />
                    </div>
                    <div>
                      <h4 className='mb-1 font-medium'>{benefit.title}</h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Process Section */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>How It Works</h3>
            <div className='space-y-4'>
              {processSteps.map((step, index) => (
                <div key={index} className='flex items-start gap-4'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white'>
                    {step.step}
                  </div>
                  <div>
                    <h4 className='mb-1 font-medium'>{step.title}</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline & Next Steps */}
          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <div className='mb-2 flex items-center gap-3'>
              <Clock className='h-5 w-5 text-amber-600' />
              <h3 className='font-semibold text-amber-800 dark:text-amber-200'>
                Typical Timeline: 3-5 Business Days
              </h3>
            </div>
            <p className='text-sm text-amber-700 dark:text-amber-300'>
              Most searches are completed within 3-5 business days. Rush
              requests available for urgent cases.
            </p>
          </div>

          {/* Call to Action */}
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-4'>
              <Badge
                variant='outline'
                className='border-green-200 text-green-700'
              >
                <CheckCircle className='mr-1 h-3 w-3' />
                No Risk - Facilitation Fee Only
              </Badge>
              <Badge
                variant='outline'
                className='border-blue-200 text-blue-700'
              >
                <Star className='mr-1 h-3 w-3' />
                Complete Coordination
              </Badge>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline' onClick={onClose}>
                Not Right Now
              </Button>
              <Button
                onClick={onGetStarted}
                className='bg-amber-500 text-white hover:bg-amber-600'
              >
                Get Started Now
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
