import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: boolean
  handleIcon?: () => void
  variant?: 'primary' | 'secondary'
}

export function Input({
  icon: Icon,
  error = false,
  handleIcon,
  className,
  disabled,
  variant = 'primary',
  ...rest
}: InputWithIconProps) {
  return (
    <div
      className={cn(
        `w-full flex items-center border relative
        border-[#0f2b92]
        focus-within:border-blue-900`,
        error && 'border-red-500',
        variant === 'secondary' &&
          'border-[#b1b3b5] focus-within:border-[#caccce]',
        disabled && 'border-[#dddfe1]`',
      )}
    >
      <input
        disabled={disabled}
        className={cn(
          'focus:outline-[#5e75cb] disabled:text-[#8181a5] disabled:bg-[#e9ecef] disabled:border-[#dddfe1] disabled:placeholder:text-[#8181a5] w-full px-3 py-2 text-sm  text-gray-900 placeholder:text-gray-800',
          Icon && 'pr-10',
          variant === 'secondary' &&
            'focus:outline-[#9c9d9e] placeholder:text-[#9c9d9e]',
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
