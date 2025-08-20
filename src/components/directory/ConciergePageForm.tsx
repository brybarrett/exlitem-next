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
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  DollarSign,
  Phone,
  CheckCircle
} from 'lucide-react';
// Removed import of practiceAreas and locations as they're no longer needed
import type { ConciergeFormData } from './ConciergeRequirementsForm';

interface ConciergePageFormProps {
  onSubmit: (data: ConciergeFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ConciergeFormData> | null;
}

const steps = [
  { id: 1, title: 'Case Details', icon: FileText },
  { id: 2, title: 'Expert Requirements', icon: User },
  { id: 3, title: 'Budget', icon: DollarSign },
  { id: 4, title: 'Contact Information', icon: Phone }
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
      // If case type is "Other", customType is required
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

export function ConciergePageForm({
  onSubmit,
  onCancel,
  initialData
}: ConciergePageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCustomCaseType, setShowCustomCaseType] = useState(false);
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

    // If initialData is provided, use it (for "Add Another Expert Request" flow)
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

    // If user is logged in and no initialData, auto-fill from Clerk
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
    storageKey: 'concierge-form-data',
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
    // Only reset if we have either initialData or user changes
    if (initialData || user) {
      const newDefaultValues = getDefaultValues();
      form.reset(newDefaultValues);

      // Set show custom case type if needed
      if (newDefaultValues.caseDetails.type === 'Other') {
        setShowCustomCaseType(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const nextStep = async () => {
    // Validate current step before proceeding
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
        // Add custom type validation if "Other" is selected
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
    }

    // Trigger validation for current step
    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: ConciergeFormData) => {
    onSubmit(data);
    clearFormData(); // Clear saved data after successful submission
    form.reset();
    setCurrentStep(1);
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
    <div className='space-y-6'>
      {/* Form Recovery Banner */}
      {showRecoveryBanner && savedFormData && (
        <FormRecoveryBanner
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          savedAt={new Date(savedFormData.timestamp)}
          className='mb-6'
        />
      )}

      {/* Auto-save indicator */}
      <div className='mb-4 flex justify-end'>
        <AutoSaveIndicator isSaving={isAutoSaving} lastSavedAt={lastSavedAt} />
      </div>

      {/* Progress Steps */}
      <div className='flex items-center justify-between overflow-x-auto pb-2'>
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className='flex flex-shrink-0 items-center'>
              <div
                className={`flex items-center gap-2 ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? 'border-2 border-blue-600 bg-blue-100'
                      : isCompleted
                        ? 'border-2 border-green-600 bg-green-100'
                        : 'border-2 border-gray-300 bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <IconComponent className='h-4 w-4' />
                  )}
                </div>
                <span className='hidden text-sm font-medium whitespace-nowrap md:block'>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 hidden h-0.5 w-8 flex-shrink-0 md:block ${
                    isCompleted ? 'bg-green-300' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* Step 1: Case Details */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold'>Tell us about your case</h3>

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
                      <FormLabel>Please specify your case type *</FormLabel>
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
                    <FormLabel>When do you need the expert? *</FormLabel>
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
              <h3 className='text-lg font-semibold'>Expert Requirements</h3>

              <FormField
                control={form.control}
                name='expertRequirements.expertDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the expert you need *</FormLabel>
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
                                    checked={field.value?.includes(qual)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, qual])
                                        : field.onChange(
                                            current.filter(
                                              (value) => value !== qual
                                            )
                                          );
                                    }}
                                    className='touch-manipulation'
                                  />
                                </FormControl>
                                <FormLabel className='flex-1 cursor-pointer touch-manipulation text-sm'>
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
                    <FormLabel>Special Requirements or Preferences</FormLabel>
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
              <h3 className='text-lg font-semibold'>Budget</h3>

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
              <h3 className='text-lg font-semibold'>Contact Information</h3>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='contact.name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder='Your full name' {...field} />
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
                        <Input placeholder='(555) 123-4567' {...field} />
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
                        <Input placeholder='Your firm name' {...field} />
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

              {/* CC Emails */}
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

          {/* Navigation Buttons */}
          <div className='flex flex-col items-stretch justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center'>
            <Button
              type='button'
              variant='outline'
              onClick={prevStep}
              disabled={currentStep === 1}
              className='order-2 w-full sm:order-1 sm:w-auto'
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>

            <div className='order-1 flex flex-col items-stretch gap-3 sm:order-2 sm:flex-row sm:items-center'>
              {onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  className='w-full sm:w-auto'
                >
                  Cancel
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  type='button'
                  onClick={nextStep}
                  className='w-full bg-blue-500 hover:bg-blue-600 sm:w-auto'
                  disabled={form.formState.isSubmitting}
                >
                  Next
                  <ChevronRight className='ml-2 h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='w-full bg-blue-500 hover:bg-blue-600 sm:w-auto'
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Submitting...'
                    : 'Submit Request'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
