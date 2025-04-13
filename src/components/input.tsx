import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: boolean
  handleIcon?: () => void
}

export function Input({
  icon: Icon,
  error = false,
  handleIcon,
  className,
  ...rest
}: InputWithIconProps) {
  return (
    <div
      className={`w-full flex items-center border relative
        ${error ? 'border-red-500' : 'border-[#0f2b92]'}
        focus-within:border-blue-900`}
    >
      <input
        className={cn(
          'focus:outline-[#5e75cb] flex-1 pl-3 pr-10 py-2 text-sm  text-gray-900 placeholder:text-gray-800',
          className,
        )}
        {...rest}
      />

      {Icon && (
        <div
          className="absolute right-0 h-full w-10 flex items-center justify-center cursor-pointer"
          onClick={handleIcon}
        >
          <Icon
            size={18}
            className={`${error ? 'text-red-500' : 'text-[#0f2b92]'}`}
          />
        </div>
      )}
    </div>
  )
}
