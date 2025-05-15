'use client'

import { cn } from '@/lib/utils'

interface StepProgressBarProps {
  step: number
  setStep: (step: number) => void
  stepsLabel: string[]
}

export function StepProgressBar({
  step,
  setStep,
  stepsLabel,
}: StepProgressBarProps) {
  function handleChangeStep(stepSelected: number) {
    if (stepSelected <= step) {
      setStep(stepSelected)
    }
  }

  const progressPercent = (step / (stepsLabel.length - 1)) * 100

  return (
    <div className="w-full flex flex-col items-center gap-4 px-6">
      <div className="relative w-full flex items-center">
        <div className="absolute top-6 left-0 w-full h-2.5 bg-[#5e81f419] rounded-full z-0 overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="w-full flex justify-between relative z-10">
          {stepsLabel.map((label, index) => {
            const isCompleted = index < step
            const isCurrent = index === step

            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col items-center group text-center transition-all',
                  index === 0 && 'items-start',
                  index === stepsLabel.length - 1 && 'items-end',
                )}
              >
                <button
                  type="button"
                  onClick={() => handleChangeStep(index)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300',
                    isCurrent
                      ? 'bg-gradient-secondary text-white border-transparent shadow-md'
                      : isCompleted
                        ? 'bg-[#0f2b92] text-white border-transparent hover:opacity-90'
                        : 'bg-white text-[#0f2b92]',
                    'cursor-pointer',
                  )}
                  tabIndex={0}
                >
                  {index + 1}
                </button>

                <span
                  className={cn(
                    'mt-2 text-sm max-w-[80px] text-muted-foreground',
                    isCurrent && 'text-foreground font-medium',
                    'hidden lg:inline-block',
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
