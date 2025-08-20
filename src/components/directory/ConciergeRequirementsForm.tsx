'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { practiceAreas, locations } from '@/lib/mock-data/practice-areas';

interface ConciergeRequirementsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConciergeFormData) => void;
}

export interface ConciergeFormData {
  caseDetails: {
    type: string;
    customType?: string;
    jurisdiction: string;
    timeline: string;
    description?: string;
  };
  expertRequirements: {
    expertDescription: string;
    experienceLevel: string;
    qualifications?: string[];
    locationPreference?: string;
    specialRequirements?: string;
  };
  budget: {
    feeRange: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    firmName?: string;
    preferredContact: string;
    ccEmails?: string[];
  };
}

const steps = [
  { id: 1, title: 'Case Details', icon: FileText },
  { id: 2, title: 'Expert Requirements', icon: User },
  { id: 3, title: 'Budget & Timeline', icon: DollarSign },
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

export function ConciergeRequirementsForm({
  isOpen,
  onClose,
  onSubmit
}: ConciergeRequirementsFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<ConciergeFormData>();

  const nextStep = () => {
    if (currentStep < steps.length) {
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
    form.reset();
    setCurrentStep(1);
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setCurrentStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-screen max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Expert Search Requirements
          </DialogTitle>

          {/* Progress Steps */}
          <div className='mt-4 mb-6 flex items-center justify-between'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className='flex items-center'>
                  <div
                    className={`flex items-center gap-2 ${
                      isActive
                        ? 'text-amber-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isActive
                          ? 'border-2 border-amber-600 bg-amber-100'
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
                    <span className='hidden text-sm font-medium md:block'>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 hidden h-0.5 w-16 md:block ${
                        isCompleted ? 'bg-green-300' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* Step 1: Case Details */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold'>
                  Tell us about your case
                </h3>

                <FormField
                  control={form.control}
                  name='caseDetails.type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
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

                <FormField
                  control={form.control}
                  name='caseDetails.jurisdiction'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select jurisdiction' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem
                              key={location.state}
                              value={location.name}
                            >
                              {location.name}
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

                <div>
                  <Label className='mb-3 block text-sm font-medium'>
                    Practice Areas *
                  </Label>
                  <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                    {practiceAreas.map((area) => (
                      <div key={area.id} className='space-y-1'>
                        <Label className='text-sm font-medium'>
                          {area.name}
                        </Label>
                        {area.subcategories.slice(0, 3).map((sub) => (
                          <div
                            key={sub}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox id={sub} />
                            <Label htmlFor={sub} className='text-xs'>
                              {sub}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

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

                <div>
                  <Label className='mb-3 block text-sm font-medium'>
                    Desired Qualifications
                  </Label>
                  <div className='grid grid-cols-2 gap-2'>
                    {qualificationOptions.map((qual) => (
                      <div key={qual} className='flex items-center space-x-2'>
                        <Checkbox id={qual} />
                        <Label htmlFor={qual} className='text-sm'>
                          {qual}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

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

            {/* Step 3: Budget & Timeline */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold'>Budget & Preferences</h3>

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
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='flex items-center justify-between border-t pt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>

              <div className='flex items-center gap-3'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  Cancel
                </Button>

                {currentStep < steps.length ? (
                  <Button type='button' onClick={nextStep}>
                    Next
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    className='bg-amber-500 hover:bg-amber-600'
                  >
                    Submit Request
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
