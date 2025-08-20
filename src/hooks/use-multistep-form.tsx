import { ReactElement, useCallback, useState } from 'react';

export default function useMultistepForm(
  steps: ReactElement<any>[],
  initialStep: number = 0
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    Math.min(Math.max(initialStep, 0), steps.length - 1)
  );

  const next = useCallback(() => {
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const back = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentStepIndex(Math.min(Math.max(index, 0), steps.length - 1));
    },
    [steps.length]
  );

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back
  };
}
