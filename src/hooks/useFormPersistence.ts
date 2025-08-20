'use client';

import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface UseFormPersistenceOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  storageKey: string;
  enabled?: boolean;
  autoSaveDelay?: number;
  onDataRestored?: (data: T) => void;
  ignoreFields?: (keyof T)[];
}

interface StoredFormData<T> {
  data: T;
  timestamp: number;
  currentStep?: number;
}

export function useFormPersistence<T extends FieldValues>({
  form,
  storageKey,
  enabled = true,
  autoSaveDelay = 1000,
  onDataRestored,
  ignoreFields = []
}: UseFormPersistenceOptions<T>) {
  const router = useRouter();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const initialDataLoadedRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!enabled) return false;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return false;

      const { data: storedData }: StoredFormData<T> = JSON.parse(stored);
      const currentData = form.getValues();

      // Deep comparison excluding ignored fields
      const compareData = (stored: any, current: any): boolean => {
        for (const key in current) {
          if (ignoreFields.includes(key as keyof T)) continue;

          if (typeof current[key] === 'object' && current[key] !== null) {
            if (!compareData(stored[key] || {}, current[key])) {
              return false;
            }
          } else if (stored[key] !== current[key]) {
            return false;
          }
        }
        return true;
      };

      return !compareData(storedData, currentData);
    } catch {
      return false;
    }
  }, [form, storageKey, enabled, ignoreFields]);

  // Save form data to localStorage
  const saveFormData = useCallback(
    (step?: number) => {
      if (!enabled) return;

      try {
        const formData = form.getValues();
        const dataToStore: StoredFormData<T> = {
          data: formData,
          timestamp: Date.now(),
          ...(step !== undefined && { currentStep: step })
        };

        localStorage.setItem(storageKey, JSON.stringify(dataToStore));
        hasUnsavedChangesRef.current = false;
      } catch (error) {
        console.warn('Failed to save form data to localStorage:', error);
      }
    },
    [form, storageKey, enabled]
  );

  // Load form data from localStorage
  const loadFormData = useCallback((): {
    data: T;
    currentStep?: number;
  } | null => {
    if (!enabled) return null;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const parsedData: StoredFormData<T> = JSON.parse(stored);

      // Check if data is not too old (24 hours)
      const isStale = Date.now() - parsedData.timestamp > 24 * 60 * 60 * 1000;
      if (isStale) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return {
        data: parsedData.data,
        currentStep: parsedData.currentStep
      };
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey, enabled]);

  // Clear saved form data
  const clearFormData = useCallback(() => {
    if (!enabled) return;

    try {
      localStorage.removeItem(storageKey);
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [storageKey, enabled]);

  // Auto-save with debounce
  const scheduleAutoSave = useCallback(
    (step?: number) => {
      if (!enabled) return;

      hasUnsavedChangesRef.current = true;

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveFormData(step);
      }, autoSaveDelay);
    },
    [saveFormData, autoSaveDelay, enabled]
  );

  // Initialize form with saved data
  useEffect(() => {
    if (!enabled || initialDataLoadedRef.current) return;

    const savedData = loadFormData();
    if (savedData && onDataRestored) {
      onDataRestored(savedData.data);
      initialDataLoadedRef.current = true;
    }
  }, [enabled, loadFormData, onDataRestored]);

  // Set up beforeunload warning
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, hasUnsavedChanges]);

  // Set up navigation warning for Next.js router
  useEffect(() => {
    if (!enabled) return;

    const handleRouteChange = () => {
      if (hasUnsavedChanges()) {
        const confirmed = window.confirm(
          'You have unsaved changes. Are you sure you want to leave this page?'
        );
        if (!confirmed) {
          // This is a bit hacky but necessary for Next.js router
          window.history.pushState(null, '', window.location.href);
          return false;
        }
      }
      return true;
    };

    // Listen for browser back/forward
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges()) {
        const confirmed = window.confirm(
          'You have unsaved changes. Are you sure you want to leave this page?'
        );
        if (!confirmed) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled, hasUnsavedChanges, router]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveFormData,
    loadFormData,
    clearFormData,
    scheduleAutoSave,
    hasUnsavedChanges: hasUnsavedChanges(),
    isAutoSaving: !!autoSaveTimeoutRef.current
  };
}
