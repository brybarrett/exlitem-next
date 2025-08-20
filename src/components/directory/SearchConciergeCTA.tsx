'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Search,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  X,
  Clock,
  CheckCircle,
  ShieldCloseIcon
} from 'lucide-react';

interface SearchConciergeCTAProps {
  variant?: 'top' | 'bottom';
  onGetStarted?: () => void;
  onClose?: () => void;
  onDismissForever?: () => void;
  isVisible?: boolean;
}

export function SearchConciergeCTA({
  variant = 'top',
  onGetStarted,
  onClose,
  onDismissForever,
  isVisible = true
}: SearchConciergeCTAProps) {
  const [showDismissDialog, setShowDismissDialog] = useState(false);
  const isTopVariant = variant === 'top';

  const handleCloseClick = () => {
    setShowDismissDialog(true);
  };

  const handleShowNextTime = () => {
    setShowDismissDialog(false);
    onClose?.();
  };

  const handleNeverShowAgain = () => {
    setShowDismissDialog(false);
    onDismissForever?.();
  };

  const topContent = {
    title: 'Save Time on Expert Search?',
    subtitle:
      'Our Search Concierge handles outreach, availability checks, and vetting so you can focus on case strategy',
    icon: Clock,
    buttonText: 'Learn More',
    features: [
      'We Handle All Outreach',
      'Availability & Conflict Checks',
      'Focus on Your Case Strategy'
    ]
  };

  const bottomContent = {
    title: 'Need More Options?',
    subtitle:
      'Our case managers can locate additional qualified professionals and handle all the coordination.',
    icon: Users,
    buttonText: 'Request Concierge Search',
    features: [
      'Extended Expert Network',
      'Complete Coordination',
      'Pay only when you retain an expert'
    ]
  };

  const content = isTopVariant ? topContent : bottomContent;
  const IconComponent = content.icon;

  if (!isVisible) return null;

  return (
    <>
      <Card className='border-primary/20 from-primary/5 to-primary/10 hover:border-primary/30 dark:from-primary/10 dark:to-primary/5 relative overflow-hidden border-2 border-dashed bg-gradient-to-br transition-all hover:shadow-lg'>
        {/* Background Pattern */}
        <div className='from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent' />

        {/* Close Button for Top Variant */}
        {variant === 'top' && onClose && (
          <Button
            onClick={handleCloseClick}
            variant='ghost'
            size='sm'
            className='hover:bg-primary/10 dark:hover:bg-primary/20 absolute top-3 right-3 text-xs'
          >
            Close
          </Button>
        )}

        <CardContent className='relative p-4 sm:p-6'>
          <div className='flex flex-col items-start gap-4 sm:flex-row'>
            {/* Icon */}
            <div className='bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg'>
              <IconComponent className='text-primary-foreground h-6 w-6' />
            </div>

            {/* Main Content */}
            <div className='w-full min-w-0 flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <h3 className='text-foreground text-lg font-semibold'>
                  {content.title}
                </h3>
              </div>

              <p className='text-muted-foreground mb-4'>{content.subtitle}</p>

              {/* Features */}
              <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
                {content.features.map((feature, index) => (
                  <div
                    key={index}
                    className='text-muted-foreground flex items-center gap-1 text-sm'
                  >
                    <CheckCircle className='text-primary h-3 w-3 flex-shrink-0' />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={onGetStarted}
                className='bg-primary text-primary-foreground hover:bg-primary/90 w-full font-medium sm:w-auto'
              >
                {content.buttonText}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>

            {/* Mobile-friendly close button could be added here if needed */}
          </div>

          {/* Engagement Facilitation Fee Highlight */}
          <div className='border-primary/20 dark:border-primary/20 mt-4 border-t pt-4'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <div className='bg-primary h-2 w-2 rounded-full'></div>
              <span>
                <strong>How it Works?</strong> Based on your request, we will
                locate experts, reach out to them, run availability and conflict
                checks, and coordinate the engagement. You pay us a success fee
                only when you decide to retain an expert presented by us.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dismiss Preferences Dialog - Outside of Card */}
      <Dialog open={showDismissDialog} onOpenChange={setShowDismissDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Hide Search Concierge?</DialogTitle>
            <DialogDescription>
              Would you like to see this Search Concierge reminder again in the
              future?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleNeverShowAgain}
              className='flex-1 sm:flex-none'
            >
              Never show again
            </Button>
            <Button
              onClick={handleShowNextTime}
              className='flex-1 sm:flex-none'
            >
              Show next time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
