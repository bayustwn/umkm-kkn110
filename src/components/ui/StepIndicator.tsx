interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-row md:px-20 justify-center items-center justify-between my-10">
      {steps.map((s, i, arr) => (
        <span key={i} className="contents">
          <div className="flex flex-col items-center z-10">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${currentStep >= i + 1 ? 'bg-primary' : 'bg-gray-400'}`}>
              {i + 1}
            </div>
            <span className={`mt-2 text-xs ${currentStep === i + 1 ? 'text-primary' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div className={`flex-1 mb-6 border-t-2 border-dashed ${currentStep > i + 1 ? 'border-primary' : 'border-gray-300'} mx-1 md:mx-2`} />
          )}
        </span>
      ))}
    </div>
  );
}
