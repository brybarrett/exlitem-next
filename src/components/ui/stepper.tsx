'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const stepperVariants = cva('flex w-full', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});

const stepVariants = cva('flex items-center transition-all duration-200', {
  variants: {
    orientation: {
      horizontal: 'flex-1',
      vertical: 'w-full'
    },
    status: {
      pending: 'text-muted-foreground',
      active: 'text-primary',
      completed: 'text-green-600 dark:text-green-400'
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    status: 'pending'
  }
});

const stepIndicatorVariants = cva(
  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out',
  {
    variants: {
      status: {
        pending:
          'border-border bg-background text-muted-foreground hover:border-muted-foreground/50',
        active:
          'border-primary bg-primary/10 text-primary shadow-lg ring-4 ring-primary/20 animate-pulse',
        completed:
          'border-green-600 bg-green-600 text-green-50 dark:border-green-400 dark:bg-green-400 dark:text-green-900 transform scale-105'
      },
      clickable: {
        true: 'cursor-pointer hover:scale-110 hover:shadow-md',
        false: 'cursor-default'
      }
    },
    defaultVariants: {
      status: 'pending',
      clickable: false
    }
  }
);

const stepConnectorVariants = cva('transition-all duration-500 ease-in-out', {
  variants: {
    orientation: {
      horizontal: 'mx-4 h-[2px] flex-1 max-w-16',
      vertical: 'my-2 ml-5 h-8 w-[2px]'
    },
    status: {
      pending: 'bg-border',
      active:
        'bg-gradient-to-r from-green-600 to-border dark:from-green-400 animate-pulse',
      completed:
        'bg-green-600 dark:bg-green-400 transform scale-y-125 shadow-sm'
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    status: 'pending'
  }
});

interface StepperContextValue {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  orientation: 'horizontal' | 'vertical';
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
);

const useStepper = () => {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a Stepper');
  }
  return context;
};

interface StepperProps extends VariantProps<typeof stepperVariants> {
  children: React.ReactNode;
  currentStep: number;
  completedSteps?: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      orientation = 'horizontal',
      currentStep,
      completedSteps = [],
      onStepClick,
      children,
      ...props
    },
    ref
  ) => {
    const stepperOrientation = orientation || 'horizontal';

    return (
      <StepperContext.Provider
        value={{
          currentStep,
          completedSteps,
          onStepClick,
          orientation: stepperOrientation
        }}
      >
        <div
          ref={ref}
          className={cn(
            stepperVariants({ orientation: stepperOrientation }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = 'Stepper';

interface StepProps {
  step: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  (
    {
      className,
      step,
      title,
      description,
      icon,
      children,
      isLast = false,
      ...props
    },
    ref
  ) => {
    const { currentStep, completedSteps, onStepClick, orientation } =
      useStepper();
    const [isNewlyActive, setIsNewlyActive] = React.useState(false);

    const status = completedSteps.includes(step)
      ? 'completed'
      : step === currentStep
        ? 'active'
        : 'pending';

    const canClick = step <= currentStep || completedSteps.includes(step);

    // Animation effect when step becomes active
    React.useEffect(() => {
      if (status === 'active') {
        setIsNewlyActive(true);
        const timer = setTimeout(() => setIsNewlyActive(false), 600);
        return () => clearTimeout(timer);
      }
    }, [status]);

    const handleClick = () => {
      if (canClick && onStepClick) {
        onStepClick(step);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          stepVariants({ orientation, status }),
          className,
          'group relative'
        )}
        {...props}
      >
        {/* Step Content */}
        <div
          className={cn(
            'flex items-center transition-all duration-300',
            orientation === 'vertical' ? 'w-full' : 'flex-1',
            status === 'active' && 'scale-102 transform'
          )}
        >
          {/* Step Indicator */}
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                stepIndicatorVariants({ status, clickable: canClick }),
                'relative z-10 h-10 w-10 p-0',
                isNewlyActive && 'animate-bounce'
              )}
              onClick={handleClick}
              disabled={!canClick}
            >
              {status === 'completed' ? (
                <Check className='animate-in fade-in-0 zoom-in-75 h-5 w-5 duration-300' />
              ) : icon ? (
                <div
                  className={cn(
                    'transition-all duration-300',
                    status === 'active' && 'animate-pulse'
                  )}
                >
                  {icon}
                </div>
              ) : (
                <span className='text-sm font-semibold'>{step}</span>
              )}
            </Button>

            {/* Active Step Glow Effect */}
            {status === 'active' && (
              <div className='bg-primary/20 absolute inset-0 animate-ping rounded-full opacity-75' />
            )}

            {/* Newly Completed Step Celebration Effect */}
            {status === 'completed' && isNewlyActive && (
              <div className='absolute inset-0 animate-ping rounded-full bg-green-500/30 opacity-75' />
            )}
          </div>

          {/* Step Label */}
          <div
            className={cn(
              'ml-4 min-w-0 flex-1 transition-all duration-300',
              orientation === 'vertical'
                ? 'flex flex-col'
                : 'hidden md:flex md:flex-col',
              status === 'active' && 'translate-x-1 transform'
            )}
          >
            <div className='flex items-center gap-2'>
              <h3
                className={cn(
                  'font-medium transition-all duration-300',
                  status === 'active' && 'text-primary font-semibold',
                  status === 'completed' &&
                    'text-green-600 dark:text-green-400',
                  status === 'pending' && 'text-muted-foreground',
                  isNewlyActive && 'animate-pulse'
                )}
              >
                {title}
              </h3>

              {/* Active indicator badge */}
              {status === 'active' && (
                <div className='bg-primary h-2 w-2 animate-pulse rounded-full' />
              )}
            </div>
            {description && (
              <p
                className={cn(
                  'text-muted-foreground mt-0.5 text-sm transition-all duration-300',
                  status === 'active' && 'text-foreground/80'
                )}
              >
                {description}
              </p>
            )}
            {children && <div className='mt-2'>{children}</div>}
          </div>
        </div>

        {/* Connector Line */}
        {!isLast && (
          <div
            className={cn(
              stepConnectorVariants({
                orientation,
                status: completedSteps.includes(step)
                  ? 'completed'
                  : step === currentStep
                    ? 'active'
                    : 'pending'
              })
            )}
          />
        )}
      </div>
    );
  }
);
Step.displayName = 'Step';

interface StepperProgressProps {
  className?: string;
  showProgress?: boolean;
  showLabels?: boolean;
  totalSteps?: number;
}

const StepperProgress = React.forwardRef<HTMLDivElement, StepperProgressProps>(
  (
    {
      className,
      showProgress = true,
      showLabels = true,
      totalSteps = 4,
      ...props
    },
    ref
  ) => {
    const { currentStep, completedSteps } = useStepper();

    const progressPercentage = (completedSteps.length / totalSteps) * 100;

    if (!showProgress && !showLabels) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted/30 dark:bg-muted/10 mt-6 flex items-center justify-between rounded-lg border p-4',
          className
        )}
        {...props}
      >
        {showLabels && (
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full'>
                <span className='text-sm font-semibold'>{currentStep}</span>
              </div>
              <span className='text-sm font-medium'>Step {currentStep}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500' />
              <span className='text-muted-foreground text-sm'>
                {completedSteps.length} completed
              </span>
            </div>
          </div>
        )}

        {showProgress && (
          <div className='flex items-center gap-2'>
            <div className='bg-muted h-2 w-32 rounded-full'>
              <div
                className='to-primary h-2 rounded-full bg-gradient-to-r from-green-500 transition-all duration-500'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className='text-muted-foreground text-sm font-medium'>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);
StepperProgress.displayName = 'StepperProgress';

export { Stepper, Step, StepperProgress, useStepper };
