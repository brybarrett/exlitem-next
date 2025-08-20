'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { FormRecoveryBanner } from '@/components/ui/form-recovery-banner';
import { AutoSaveIndicator } from '@/components/ui/auto-save-indicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExpandableTextarea } from '@/components/ui/expandable-textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CCEmailsInput } from '@/components/ui/cc-emails-input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Stepper, Step, StepperProgress } from '@/components/ui/stepper';
import { ContextSidebar } from './ContextSidebar';
import {
  FileText,
  User,
  DollarSign,
  Phone,
  CheckCircle,
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConciergeFormData } from './ConciergeRequirementsForm';

interface VisualJourneyFormProps {
  onSubmit: (data: ConciergeFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ConciergeFormData> | null;
}

const steps = [
  {
    id: 1,
    title: 'Case Details',
    description: 'Tell us about your case type, jurisdiction, and timeline',
    icon: FileText,
    status: 'pending' as const
  },
  {
    id: 2,
    title: 'Expert Requirements',
    description: 'Describe the expert qualifications and experience needed',
    icon: User,
    status: 'pending' as const
  },
  {
    id: 3,
    title: 'Budget',
    description: 'Set your preferred fee range for the expert',
    icon: DollarSign,
    status: 'pending' as const
  },
  {
    id: 4,
    title: 'Contact Information',
    description: 'Provide your contact details and preferences',
    icon: Phone,
    status: 'pending' as const
  }
];

const caseTypes = [
  'Personal Injury',
  'Medical Malpractice',
  'Product Liability',
  'Construction Defect',
  'Employment',
  'Intellectual Property',
  'Commercial Litigation',
  'Criminal Defense',
  'Family Law',
  'Other'
];

const experienceLevels = [
  'Entry Level (1-5 years)',
  'Mid-Level (5-15 years)',
  'Senior Level (15+ years)',
  'Distinguished Expert (25+ years)'
];

const qualificationOptions = [
  'Board Certification',
  'Academic Affiliation',
  'Published Research',
  'Industry Recognition',
  'Speaking Experience',
  'Previous Testimony Experience'
];

const timelineOptions = [
  'ASAP (Rush - 1-2 days)',
  'Urgent (3-5 days)',
  'Standard (1-2 weeks)',
  'Flexible (2+ weeks)'
];

const feeRanges = [
  'Budget Conscious ($200-$400/hr)',
  'Standard ($400-$600/hr)',
  'Premium ($600-$800/hr)',
  'Top Tier ($800+/hr)',
  'Does not matter'
];

const formSchema = z
  .object({
    caseDetails: z.object({
      type: z.string().min(1, 'Case type is required'),
      customType: z.string().optional(),
      jurisdiction: z.string().min(1, 'Jurisdiction is required'),
      timeline: z.string().min(1, 'Timeline is required'),
      description: z.string().optional()
    }),
    expertRequirements: z.object({
      expertDescription: z.string().min(1, 'Expert description is required'),
      experienceLevel: z.string().min(1, 'Experience level is required'),
      qualifications: z.array(z.string()).optional().default([]),
      locationPreference: z.string().optional().default(''),
      specialRequirements: z.string().optional().default('')
    }),
    budget: z.object({
      feeRange: z.string().min(1, 'Fee range is required')
    }),
    contact: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
      phone: z.string().min(1, 'Phone number is required'),
      firmName: z.string().optional().default(''),
      preferredContact: z
        .string()
        .min(1, 'Preferred contact method is required'),
      ccEmails: z
        .array(z.string().email('Invalid email format'))
        .optional()
        .default([])
    })
  })
  .refine(
    (data) => {
      if (data.caseDetails.type === 'Other') {
        return (
          data.caseDetails.customType && data.caseDetails.customType.length > 0
        );
      }
      return true;
    },
    {
      message: 'Please specify your case type',
      path: ['caseDetails', 'customType']
    }
  );

export function VisualJourneyForm({
  onSubmit,
  onCancel,
  initialData
}: VisualJourneyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCustomCaseType, setShowCustomCaseType] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);
  const [savedFormData, setSavedFormData] = useState<{
    data: ConciergeFormData;
    timestamp: number;
  } | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { user } = useUser();

  // Helper function to get default values with Clerk user data
  const getDefaultValues = (): ConciergeFormData => {
    const baseDefaults: ConciergeFormData = {
      caseDetails: {
        type: '',
        customType: '',
        jurisdiction: '',
        timeline: '',
        description: ''
      },
      expertRequirements: {
        expertDescription: '',
        experienceLevel: '',
        qualifications: [],
        locationPreference: '',
        specialRequirements: ''
      },
      budget: {
        feeRange: ''
      },
      contact: {
        name: '',
        email: '',
        phone: '',
        firmName: '',
        preferredContact: '',
        ccEmails: []
      }
    };

    if (initialData) {
      return {
        ...baseDefaults,
        ...initialData,
        contact: {
          ...baseDefaults.contact,
          ...initialData.contact,
          ccEmails: initialData.contact?.ccEmails || []
        }
      };
    }

    if (user) {
      return {
        ...baseDefaults,
        contact: {
          ...baseDefaults.contact,
          name: user.fullName || '',
          email: user.emailAddresses[0]?.emailAddress || ''
        }
      };
    }

    return baseDefaults;
  };

  const form = useForm<ConciergeFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues()
  });

  const formData = form.watch();

  // Form persistence hook
  const {
    saveFormData,
    loadFormData,
    clearFormData,
    scheduleAutoSave,
    hasUnsavedChanges,
    isAutoSaving
  } = useFormPersistence<ConciergeFormData>({
    form,
    storageKey: 'concierge-visual-form-data',
    enabled: true,
    autoSaveDelay: 2000,
    onDataRestored: (data) => {
      console.log('Form data restored from localStorage');
    },
    ignoreFields: []
  });

  // Check for saved form data on component mount
  useEffect(() => {
    if (!initialData) {
      // Only check for saved data if no initialData is provided
      const saved = loadFormData();
      if (saved) {
        setSavedFormData({
          data: saved.data,
          timestamp: saved.currentStep || Date.now()
        });
        setShowRecoveryBanner(true);
        if (saved.currentStep !== undefined) {
          setCurrentStep(saved.currentStep);
        }
      }
    }
  }, [loadFormData, initialData]);

  // Handle initial data updates or user data changes
  useEffect(() => {
    if (initialData || user) {
      const newDefaultValues = getDefaultValues();
      form.reset(newDefaultValues);

      if (newDefaultValues.caseDetails.type === 'Other') {
        setShowCustomCaseType(true);
      }
    }
  }, [initialData, user?.id, user?.fullName, user?.emailAddresses]);

  // Auto-save form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      scheduleAutoSave(currentStep);
    });
    return () => subscription.unsubscribe();
  }, [form, scheduleAutoSave, currentStep]);

  // Update last saved timestamp when auto-saving completes
  useEffect(() => {
    if (!isAutoSaving) {
      setLastSavedAt(new Date());
    }
  }, [isAutoSaving]);

  const handleStepClick = async (stepId: number) => {
    // Validate current step if moving forward
    if (stepId > currentStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
    }

    setCurrentStep(stepId);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (
      | keyof ConciergeFormData
      | `${keyof ConciergeFormData}.${string}`
    )[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          'caseDetails.type',
          'caseDetails.jurisdiction',
          'caseDetails.timeline'
        ];
        if (form.getValues('caseDetails.type') === 'Other') {
          fieldsToValidate.push('caseDetails.customType');
        }
        break;
      case 2:
        fieldsToValidate = [
          'expertRequirements.expertDescription',
          'expertRequirements.experienceLevel'
        ];
        break;
      case 3:
        fieldsToValidate = ['budget.feeRange'];
        break;
      case 4:
        fieldsToValidate = [
          'contact.name',
          'contact.email',
          'contact.phone',
          'contact.preferredContact'
        ];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid) {
      setCompletedSteps((prev) => [
        ...prev.filter((id) => id !== currentStep),
        currentStep
      ]);
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: ConciergeFormData) => {
    // Validate all steps before submission
    const allValid = await form.trigger();
    if (allValid) {
      onSubmit(data);
      clearFormData(); // Clear saved data after successful submission
      form.reset();
      setCurrentStep(1);
      setCompletedSteps([]);
    }
  };

  const handleRestoreDraft = () => {
    if (savedFormData) {
      form.reset(savedFormData.data);
      // Set custom case type visibility if needed
      if (savedFormData.data.caseDetails.type === 'Other') {
        setShowCustomCaseType(true);
      }
      setShowRecoveryBanner(false);
    }
  };

  const handleDiscardDraft = () => {
    clearFormData();
    setShowRecoveryBanner(false);
    setSavedFormData(null);
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        {/* Form Recovery Banner */}
        {showRecoveryBanner && savedFormData && (
          <FormRecoveryBanner
            onRestore={handleRestoreDraft}
            onDiscard={handleDiscardDraft}
            savedAt={new Date(savedFormData.timestamp)}
            className='mb-6'
          />
        )}

        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-foreground text-3xl font-bold'>
                Search Concierge
              </h1>
              <p className='text-muted-foreground mt-2'>
                Let us handle your expert search from start to finish
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <AutoSaveIndicator
                isSaving={isAutoSaving}
                lastSavedAt={lastSavedAt}
                className='hidden sm:flex'
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className='lg:hidden'
              >
                <Eye className='h-5 w-5' />
              </Button>
              {onCancel && (
                <Button variant='outline' onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className='mb-8'>
          <Stepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            orientation='horizontal'
            className='mb-6'
          >
            {steps.map((step, index) => (
              <Step
                key={step.id}
                step={step.id}
                title={step.title}
                description={step.description}
                icon={<step.icon className='h-5 w-5' />}
                isLast={index === steps.length - 1}
              />
            ))}
          </Stepper>

          {/* Progress Summary */}
          <div className='bg-muted/30 dark:bg-muted/10 mt-6 flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full'>
                  <span className='text-sm font-semibold'>{currentStep}</span>
                </div>
                <span className='text-sm font-medium'>
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-green-500' />
                <span className='text-muted-foreground text-sm'>
                  {completedSteps.length} completed
                </span>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='bg-muted relative h-2 w-32 overflow-hidden rounded-full'>
                  <div
                    className='to-primary relative h-2 rounded-full bg-gradient-to-r from-green-500 transition-all duration-700 ease-out'
                    style={{
                      width: `${(completedSteps.length / steps.length) * 100}%`
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                  </div>
                </div>
                <span className='text-muted-foreground text-sm font-medium transition-all duration-300'>
                  {Math.round((completedSteps.length / steps.length) * 100)}%
                </span>
              </div>

              {/* Mobile auto-save indicator */}
              <AutoSaveIndicator
                isSaving={isAutoSaving}
                lastSavedAt={lastSavedAt}
                className='sm:hidden'
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Form */}
          <div className='lg:col-span-2'>
            <div className='bg-card rounded-lg border p-6 shadow-sm'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='space-y-8'
                >
                  {/* Step 1: Case Details */}
                  {currentStep === 1 && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <h2 className='text-foreground text-2xl font-semibold'>
                          Case Details
                        </h2>
                        <p className='text-muted-foreground mt-2'>
                          Tell us about your case type, jurisdiction, and
                          timeline
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name='caseDetails.type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case Type *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setShowCustomCaseType(value === 'Other');
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select case type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {caseTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {showCustomCaseType && (
                        <FormField
                          control={form.control}
                          name='caseDetails.customType'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Please specify your case type *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Please specify your case type'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name='caseDetails.jurisdiction'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jurisdiction *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='e.g., California, New York, Federal Court'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='caseDetails.timeline'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              When do you need the expert? *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select timeline' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timelineOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='caseDetails.description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Provide a brief description of your case and any specific circumstances...'
                                className='min-h-[100px]'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Expert Requirements */}
                  {currentStep === 2 && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <h2 className='text-foreground text-2xl font-semibold'>
                          Expert Requirements
                        </h2>
                        <p className='text-muted-foreground mt-2'>
                          Describe the expert qualifications and experience
                          needed
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name='expertRequirements.expertDescription'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Describe the expert you need *
                            </FormLabel>
                            <FormControl>
                              <ExpandableTextarea
                                placeholder='Describe the type of expert, specialization, and specific qualifications you need...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='expertRequirements.experienceLevel'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select experience level' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='expertRequirements.qualifications'
                        render={() => (
                          <FormItem>
                            <FormLabel className='mb-3 block text-sm font-medium'>
                              Desired Qualifications
                            </FormLabel>
                            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                              {qualificationOptions.map((qual) => (
                                <FormField
                                  key={qual}
                                  control={form.control}
                                  name='expertRequirements.qualifications'
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={qual}
                                        className='flex flex-row items-center space-y-0 space-x-2 py-1'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              qual
                                            )}
                                            onCheckedChange={(checked) => {
                                              const current = field.value || [];
                                              return checked
                                                ? field.onChange([
                                                    ...current,
                                                    qual
                                                  ])
                                                : field.onChange(
                                                    current.filter(
                                                      (value) => value !== qual
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='flex-1 cursor-pointer text-sm'>
                                          {qual}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='expertRequirements.specialRequirements'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Special Requirements or Preferences
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Any specific qualifications, experience, or other requirements...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Budget */}
                  {currentStep === 3 && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <h2 className='text-foreground text-2xl font-semibold'>
                          Budget
                        </h2>
                        <p className='text-muted-foreground mt-2'>
                          Set your preferred fee range for the expert
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name='budget.feeRange'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Fee Range *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select fee range' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {feeRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Contact Information */}
                  {currentStep === 4 && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <h2 className='text-foreground text-2xl font-semibold'>
                          Contact Information
                        </h2>
                        <p className='text-muted-foreground mt-2'>
                          Provide your contact details and preferences
                        </p>
                      </div>

                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='contact.name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Your full name'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='contact.email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type='email'
                                  placeholder='your@email.com'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='contact.phone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='(555) 123-4567'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='contact.firmName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Law Firm / Organization</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Your firm name'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name='contact.preferredContact'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact Method *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='How should we contact you?' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='email'>Email</SelectItem>
                                <SelectItem value='phone'>Phone</SelectItem>
                                <SelectItem value='both'>
                                  Both Email and Phone
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='contact.ccEmails'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CCEmailsInput
                                value={field.value || []}
                                onChange={field.onChange}
                                maxEmails={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className='flex items-center justify-between border-t pt-6'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>

                    <div className='flex items-center gap-3'>
                      {currentStep < steps.length ? (
                        <Button
                          type='button'
                          onClick={nextStep}
                          className='group bg-gradient-to-r from-amber-500 to-amber-600 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl active:scale-95'
                        >
                          Next Step
                          <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                        </Button>
                      ) : (
                        <Button
                          type='submit'
                          className='bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 hover:shadow-xl'
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            'Submitting...'
                          ) : (
                            <>
                              <CheckCircle className='mr-2 h-4 w-4' />
                              Submit Request
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Context Sidebar */}
          {sidebarVisible && (
            <div className='lg:col-span-1'>
              <div className='sticky top-8'>
                <ContextSidebar
                  formData={formData}
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onEditStep={handleStepClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
