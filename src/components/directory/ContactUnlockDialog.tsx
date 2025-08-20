import React, { useState } from 'react';
import {
  Lock,
  AlertCircle,
  Clock,
  Shield,
  CreditCard,
  CheckCircle2,
  X
} from 'lucide-react';

interface ContactUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expertName?: string;
}

const ContactUnlockDialog: React.FC<ContactUnlockDialogProps> = ({
  isOpen,
  onClose,
  expertName
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = () => {
    setIsProcessing(true);
    // TODO: Implement actual unlock logic
    console.log('Unlock clicked for expert:', expertName);
    // Reset processing state after a delay (remove in production)
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-900'>
        {/* Header */}
        <div className='border-b border-gray-200 p-6 dark:border-gray-800'>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <Lock className='h-5 w-5 text-blue-600' />
              Unlock Contact Information
            </h2>
            <button
              onClick={onClose}
              className='rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
          {expertName && (
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              for {expertName}
            </p>
          )}
        </div>

        {/* Content */}
        <div className='space-y-6 p-6'>
          {/* Expert Status */}
          <div className='rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20'>
            <div className='flex gap-3'>
              <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600' />
              <div>
                <h3 className='font-medium text-amber-900 dark:text-amber-200'>
                  Unclaimed Expert Profile
                </h3>
                <p className='mt-1 text-sm text-amber-700 dark:text-amber-300'>
                  This expert hasn't verified their profile yet. We can help you
                  connect with them.
                </p>
              </div>
            </div>
          </div>

          {/* Service Offering */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>
              Get Verified Contact Details
            </h3>

            <div className='space-y-4 rounded-lg bg-gray-50 p-5 dark:bg-gray-800'>
              <div className='flex items-start gap-3'>
                <Clock className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600' />
                <div className='flex-1'>
                  <p className='font-medium'>2 Business Days Delivery</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Our research team will verify and deliver confirmed contact
                    information
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Shield className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-600' />
                <div className='flex-1'>
                  <p className='font-medium'>100% Money-Back Guarantee</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    If we can't find verified contact details, choose your
                    refund:
                  </p>
                  <ul className='mt-2 space-y-1 text-sm'>
                    <li className='flex items-center gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500' />
                      <span>Full cash refund ($99)</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500' />
                      <span>Double platform credits ($198 value)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className='py-4 text-center'>
              <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                $99
              </div>
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                One-time fee
              </p>
            </div>
          </div>

          {/* What You'll Receive */}
          <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
            <p className='mb-2 font-medium'>You'll receive:</p>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Verified email address</li>
              <li>• Phone number (when available)</li>
              <li>• Professional contact preferences</li>
              <li>• Best times to reach out</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3 border-t border-gray-200 p-6 dark:border-gray-800'>
          <button
            className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-700'
            onClick={handleUnlock}
            disabled={isProcessing}
          >
            <CreditCard className='h-4 w-4' />
            {isProcessing ? 'Processing...' : 'Unlock for $99'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUnlockDialog;
