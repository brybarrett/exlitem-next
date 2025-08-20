'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  FileText,
  User,
  DollarSign,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConciergeFormData } from './ConciergeRequirementsForm';

interface ContextSidebarProps {
  formData: Partial<ConciergeFormData>;
  currentStep: number;
  completedSteps: number[];
  onEditStep: (stepId: number) => void;
  className?: string;
}

export function ContextSidebar({
  formData,
  currentStep,
  completedSteps,
  onEditStep,
  className
}: ContextSidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>([`item-${currentStep}`]);

  const getStepCompletionStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const formatArray = (arr: string[] | undefined): string => {
    if (!arr || arr.length === 0) return 'None selected';
    if (arr.length <= 2) return arr.join(', ');
    return `${arr[0]}, ${arr[1]} +${arr.length - 2} more`;
  };

  // Ensure current step is always open
  useEffect(() => {
    const currentItem = `item-${currentStep}`;
    if (!openItems.includes(currentItem)) {
      setOpenItems((prev) => [...prev, currentItem]);
    }
  }, [currentStep, openItems]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className='bg-card rounded-lg border shadow-sm'>
        <Accordion
          type='multiple'
          value={openItems}
          onValueChange={setOpenItems}
          className='w-full'
        >
          {/* Case Details */}
          <AccordionItem
            value='item-1'
            className='border-b px-4 first:rounded-t-lg'
          >
            <div className='relative'>
              <AccordionTrigger className='py-4 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <FileText className='text-primary h-4 w-4' />
                  <span className='font-medium'>Case Details</span>
                  <div className='ml-2 flex items-center gap-2'>
                    {getStepCompletionStatus(1) === 'completed' && (
                      <CheckCircle className='text-primary h-4 w-4' />
                    )}
                    {getStepCompletionStatus(1) === 'active' && (
                      <div className='border-primary bg-primary/10 h-4 w-4 rounded-full border-2' />
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pb-8'>
                <div className='space-y-3'>
                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <Briefcase className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Type
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.caseDetails?.type === 'Other'
                        ? formData.caseDetails?.customType || 'Not specified'
                        : formData.caseDetails?.type || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <MapPin className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Jurisdiction
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.caseDetails?.jurisdiction || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <Calendar className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Timeline
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.caseDetails?.timeline || 'Not specified'}
                    </p>
                  </div>

                  {formData.caseDetails?.description && (
                    <div>
                      <div className='mb-1 flex items-center gap-1'>
                        <FileText className='text-muted-foreground h-3 w-3' />
                        <span className='text-muted-foreground text-xs font-medium'>
                          Description
                        </span>
                      </div>
                      <p className='text-muted-foreground line-clamp-2 text-xs'>
                        {formData.caseDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
              {openItems.includes('item-1') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditStep(1)}
                  className='hover:bg-primary/10 absolute right-0 bottom-2 h-8 w-8 p-0'
                >
                  <Edit3 className='h-3 w-3' />
                </Button>
              )}
            </div>
          </AccordionItem>

          {/* Expert Requirements */}
          <AccordionItem value='item-2' className='border-b px-4'>
            <div className='relative'>
              <AccordionTrigger className='py-4 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <User className='text-primary h-4 w-4' />
                  <span className='font-medium'>Expert Requirements</span>
                  <div className='ml-2 flex items-center gap-2'>
                    {getStepCompletionStatus(2) === 'completed' && (
                      <CheckCircle className='text-primary h-4 w-4' />
                    )}
                    {getStepCompletionStatus(2) === 'active' && (
                      <div className='border-primary bg-primary/10 h-4 w-4 rounded-full border-2' />
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pb-8'>
                <div className='space-y-3'>
                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <User className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Expert Type
                      </span>
                    </div>
                    <p className='line-clamp-2 text-sm'>
                      {formData.expertRequirements?.expertDescription ||
                        'Not specified'}
                    </p>
                  </div>

                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <Badge className='h-3 w-3 rounded-full p-0' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Experience
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.expertRequirements?.experienceLevel ||
                        'Not specified'}
                    </p>
                  </div>

                  {formData.expertRequirements?.qualifications &&
                    formData.expertRequirements.qualifications.length > 0 && (
                      <div>
                        <div className='mb-1 flex items-center gap-1'>
                          <CheckCircle className='text-muted-foreground h-3 w-3' />
                          <span className='text-muted-foreground text-xs font-medium'>
                            Qualifications
                          </span>
                        </div>
                        <p className='text-sm'>
                          {formatArray(
                            formData.expertRequirements.qualifications
                          )}
                        </p>
                      </div>
                    )}

                  {formData.expertRequirements?.locationPreference && (
                    <div>
                      <div className='mb-1 flex items-center gap-1'>
                        <MapPin className='text-muted-foreground h-3 w-3' />
                        <span className='text-muted-foreground text-xs font-medium'>
                          Location
                        </span>
                      </div>
                      <p className='text-sm'>
                        {formData.expertRequirements.locationPreference}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
              {openItems.includes('item-2') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditStep(2)}
                  className='hover:bg-primary/10 absolute right-0 bottom-2 h-8 w-8 p-0'
                >
                  <Edit3 className='h-3 w-3' />
                </Button>
              )}
            </div>
          </AccordionItem>

          {/* Budget */}
          <AccordionItem value='item-3' className='border-b px-4'>
            <div className='relative'>
              <AccordionTrigger className='py-4 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <DollarSign className='text-primary h-4 w-4' />
                  <span className='font-medium'>Budget</span>
                  <div className='ml-2 flex items-center gap-2'>
                    {getStepCompletionStatus(3) === 'completed' && (
                      <CheckCircle className='text-primary h-4 w-4' />
                    )}
                    {getStepCompletionStatus(3) === 'active' && (
                      <div className='border-primary bg-primary/10 h-4 w-4 rounded-full border-2' />
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pb-8'>
                <div className='space-y-3'>
                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <DollarSign className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Fee Range
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.budget?.feeRange || 'Not specified'}
                    </p>
                  </div>
                </div>
              </AccordionContent>
              {openItems.includes('item-3') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditStep(3)}
                  className='hover:bg-primary/10 absolute right-0 bottom-2 h-8 w-8 p-0'
                >
                  <Edit3 className='h-3 w-3' />
                </Button>
              )}
            </div>
          </AccordionItem>

          {/* Contact Information */}
          <AccordionItem value='item-4' className='px-4 last:rounded-b-lg'>
            <div className='relative'>
              <AccordionTrigger className='py-4 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <Phone className='text-primary h-4 w-4' />
                  <span className='font-medium'>Contact Information</span>
                  <div className='ml-2 flex items-center gap-2'>
                    {getStepCompletionStatus(4) === 'completed' && (
                      <CheckCircle className='text-primary h-4 w-4' />
                    )}
                    {getStepCompletionStatus(4) === 'active' && (
                      <div className='border-primary bg-primary/10 h-4 w-4 rounded-full border-2' />
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pb-12'>
                <div className='space-y-3'>
                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <User className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Name
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.contact?.name || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <Mail className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Email
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.contact?.email || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <div className='mb-1 flex items-center gap-1'>
                      <Phone className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs font-medium'>
                        Phone
                      </span>
                    </div>
                    <p className='text-sm'>
                      {formData.contact?.phone || 'Not specified'}
                    </p>
                  </div>

                  {formData.contact?.firmName && (
                    <div>
                      <div className='mb-1 flex items-center gap-1'>
                        <Briefcase className='text-muted-foreground h-3 w-3' />
                        <span className='text-muted-foreground text-xs font-medium'>
                          Firm
                        </span>
                      </div>
                      <p className='text-sm'>{formData.contact.firmName}</p>
                    </div>
                  )}

                  {formData.contact?.ccEmails &&
                    formData.contact.ccEmails.length > 0 && (
                      <div>
                        <div className='mb-1 flex items-center gap-1'>
                          <Mail className='text-muted-foreground h-3 w-3' />
                          <span className='text-muted-foreground text-xs font-medium'>
                            CC Emails
                          </span>
                        </div>
                        <p className='text-sm'>
                          {formatArray(formData.contact.ccEmails)}
                        </p>
                      </div>
                    )}
                </div>
              </AccordionContent>
              {openItems.includes('item-4') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditStep(4)}
                  className='hover:bg-primary/10 absolute right-3 bottom-3 h-8 w-8 p-0'
                >
                  <Edit3 className='h-3 w-3' />
                </Button>
              )}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
