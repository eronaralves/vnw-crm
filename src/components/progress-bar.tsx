'use client'

// Utils
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
    if (stepSelected < step) {
      setStep(stepSelected)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-3 px-6">
      <div className="w-full">
        <div className="relative flex justify-between gap-8">
          {stepsLabel.map((label, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center z-10',
                index === 0 && 'items-start',
                index === stepsLabel.length - 1 && 'items-end',
              )}
            >
              <div
                onClick={() => handleChangeStep(index)}
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center cursor-pointer',
                  index === step
                    ? 'bg-gradient-secondary text-white'
                    : index < step
                      ? 'bg-[#0f2b92] text-white'
                      : 'bg-white text-[#0f2b92] border-2 border-[#0F2B925C]',
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  'hidden text-sm mt-2 lg:flex',
                  index === step && 'font-semibold',
                )}
              >
                {label}
              </span>
            </div>
          ))}

          <div className="absolute w-full flex items-center top-6 left-0 right-0 h-2.5 z-0">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{
                width: `${(step / (stepsLabel.length - 1)) * 100}% `,
              }}
            />
            <div className="h-full bg-[#5e81f419] transition-all duration-500 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
