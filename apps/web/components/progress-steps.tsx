'use client';

interface ProgressStepsProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { label: 'Rooms', icon: '1' },
  { label: 'Walkthrough', icon: '2' },
  { label: 'Review', icon: '3' },
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.label} className="flex items-center">
            {/* Connector line */}
            {i > 0 && (
              <div
                className={`h-0.5 w-8 sm:w-16 transition-colors ${
                  isCompleted || isActive ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-4 ring-primary/10'
                    : 'border-2 border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
