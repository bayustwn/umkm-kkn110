import { useState } from 'react';

export default function useMultiStep(totalSteps: number) {
  const [step, setStep] = useState(1);

  return {
    step,
    setStep,
    next: () => setStep((s) => Math.min(s + 1, totalSteps)),
    prev: () => setStep((s) => Math.max(s - 1, 1)),
    goTo: (s: number) => setStep(s),
    isFirst: step === 1,
    isLast: step === totalSteps,
    totalSteps,
  };
}
