'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  User,
  DollarSign,
  Phone,
  CheckCircle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'active' | 'completed';
  isOptional?: boolean;
}

interface VisualJourneyTimelineProps {
  steps: TimelineStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  completedSteps: number[];
  className?: string;
}

export function VisualJourneyTimeline({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
  className
}: VisualJourneyTimelineProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const getStepStatus = (
    stepId: number
  ): 'pending' | 'active' | 'completed' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const canNavigateToStep = (stepId: number): boolean => {
    // Can navigate to any completed step or the current step
    return stepId <= currentStep || completedSteps.includes(stepId);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile Timeline - Stacked */}
      <div className='block md:hidden'>
        <div className='space-y-4'>
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const status = getStepStatus(step.id);
            const isClickable = canNavigateToStep(step.id);

            return (
              <div key={step.id} className='flex items-start gap-4'>
                {/* Icon and connector */}
                <div className='flex flex-col items-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full border-2 p-0 transition-all duration-200',
                      status === 'completed' &&
                        'border-green-500 bg-green-100 text-green-700 hover:bg-green-200',
                      status === 'active' &&
                        'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200',
                      status === 'pending' &&
                        'border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200',
                      isClickable && 'cursor-pointer',
                      !isClickable && 'cursor-not-allowed opacity-60'
                    )}
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className='h-5 w-5' />
                    ) : (
                      <IconComponent className='h-5 w-5' />
                    )}
                  </Button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'mt-2 h-8 w-0.5 transition-colors duration-200',
                        status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className='min-w-0 flex-1 pb-6'>
                  <div className='mb-1 flex items-center gap-2'>
                    <h4
                      className={cn(
                        'font-medium',
                        status === 'active' && 'text-blue-700',
                        status === 'completed' && 'text-green-700',
                        status === 'pending' && 'text-gray-600'
                      )}
                    >
                      {step.title}
                    </h4>
                    {step.isOptional && (
                      <Badge variant='outline' className='text-xs'>
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Timeline - Horizontal */}
      <div className='hidden md:block'>
        <div className='relative'>
          {/* Timeline line */}
          <div className='absolute top-6 left-0 h-0.5 w-full bg-gray-200' />

          {/* Progress line */}
          <div
            className='absolute top-6 left-0 h-0.5 bg-blue-500 transition-all duration-500'
            style={{
              width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />

          {/* Steps */}
          <div className='relative flex justify-between'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const status = getStepStatus(step.id);
              const isClickable = canNavigateToStep(step.id);
              const isHovered = hoveredStep === step.id;

              return (
                <div
                  key={step.id}
                  className='flex flex-col items-center'
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-0 shadow-sm transition-all duration-200',
                      status === 'completed' &&
                        'border-green-500 bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-lg',
                      status === 'active' &&
                        'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-lg',
                      status === 'pending' &&
                        'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:bg-gray-100',
                      isClickable && 'cursor-pointer',
                      !isClickable && 'cursor-not-allowed opacity-60',
                      isHovered && isClickable && 'scale-110 shadow-lg'
                    )}
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className='h-5 w-5' />
                    ) : (
                      <IconComponent className='h-5 w-5' />
                    )}

                    {/* Active indicator */}
                    {status === 'active' && (
                      <div className='absolute -inset-1 animate-pulse rounded-full border-2 border-blue-300 opacity-60' />
                    )}
                  </Button>

                  {/* Step info */}
                  <div className='mt-4 text-center'>
                    <div className='mb-1 flex items-center justify-center gap-1'>
                      <h4
                        className={cn(
                          'text-sm font-medium transition-colors duration-200',
                          status === 'active' && 'text-blue-700',
                          status === 'completed' && 'text-green-700',
                          status === 'pending' && 'text-gray-600',
                          isHovered && isClickable && 'text-blue-600'
                        )}
                      >
                        {step.title}
                      </h4>
                      {step.isOptional && (
                        <Badge variant='outline' className='text-xs'>
                          Optional
                        </Badge>
                      )}
                    </div>

                    {/* Description tooltip on hover */}
                    {isHovered && (
                      <div className='absolute z-10 mt-2 w-48 rounded-lg border bg-white p-3 shadow-lg'>
                        <p className='text-xs text-gray-600'>
                          {step.description}
                        </p>
                        <div className='absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-r-4 border-b-4 border-l-4 border-transparent border-b-white' />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress summary */}
        <div className='mt-8 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                <Eye className='h-4 w-4 text-blue-600' />
              </div>
              <span className='text-sm font-medium'>
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs'>
                {completedSteps.length} completed
              </Badge>
              <Badge variant='outline' className='text-xs'>
                {steps.length - completedSteps.length - 1} remaining
              </Badge>
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            Click any step to navigate
          </div>
        </div>
      </div>
    </div>
  );
}
