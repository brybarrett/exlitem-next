'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CCEmailsInputProps {
  value?: string[];
  onChange: (emails: string[]) => void;
  className?: string;
  maxEmails?: number;
}

export function CCEmailsInput({
  value = [],
  onChange,
  className,
  maxEmails = 5
}: CCEmailsInputProps) {
  const [newEmail, setNewEmail] = useState('');
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    if (!newEmail.trim()) return;

    const trimmedEmail = newEmail.trim().toLowerCase();

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      return;
    }

    // Check for duplicates
    if (value.includes(trimmedEmail)) {
      return;
    }

    // Check max limit
    if (value.length >= maxEmails) {
      return;
    }

    onChange([...value, trimmedEmail]);
    setNewEmail('');
  };

  const removeEmail = (index: number) => {
    const newEmails = value.filter((_, i) => i !== index);
    onChange(newEmails);

    // Clear any errors for removed email
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const validateExistingEmail = (email: string, index: number) => {
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, [index]: 'Invalid email format' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className='flex items-center gap-2'>
        <Mail className='h-4 w-4 text-blue-500' />
        <Label className='text-sm font-medium'>CC Emails (Optional)</Label>
        <span className='text-muted-foreground text-xs'>
          {value.length}/{maxEmails}
        </span>
      </div>

      <p className='text-muted-foreground text-xs'>
        Add additional email addresses to receive copies of this request
      </p>

      {/* Existing CC Emails */}
      {value.length > 0 && (
        <div className='space-y-2'>
          {value.map((email, index) => (
            <div key={index} className='flex items-center gap-2'>
              <Input
                type='email'
                value={email}
                onChange={(e) => {
                  const newEmails = [...value];
                  newEmails[index] = e.target.value;
                  onChange(newEmails);
                  validateExistingEmail(e.target.value, index);
                }}
                onBlur={() => validateExistingEmail(email, index)}
                className={cn(
                  'flex-1',
                  errors[index] && 'border-red-500 focus:border-red-500'
                )}
                placeholder='colleague@lawfirm.com'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => removeEmail(index)}
                className='h-10 w-10 p-0 hover:border-red-200 hover:bg-red-50'
              >
                <X className='h-4 w-4 text-red-500' />
              </Button>
            </div>
          ))}

          {/* Show validation errors */}
          {Object.entries(errors).map(([index, error]) => (
            <p key={index} className='mt-1 text-xs text-red-500'>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Add New Email */}
      {value.length < maxEmails && (
        <div className='flex items-center gap-2'>
          <Input
            type='email'
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Add CC email address...'
            className='flex-1'
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addEmail}
            disabled={!newEmail.trim() || !validateEmail(newEmail.trim())}
            className='h-10 px-3 hover:border-blue-200 hover:bg-blue-50'
          >
            <Plus className='h-4 w-4 text-blue-500' />
          </Button>
        </div>
      )}

      {value.length >= maxEmails && (
        <p className='text-muted-foreground text-xs'>
          Maximum of {maxEmails} CC emails allowed
        </p>
      )}
    </div>
  );
}
