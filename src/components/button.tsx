import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

// Icons
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  children?: ReactNode
  variant?: 'primary' | 'secondary'
  isPending?: boolean
}

export function Button({
  title,
  children,
  variant = 'primary',
  className,
  isPending = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'min-w-20 h-max flex items-center justify-center gap-2 px-4 py-2 font-bold text-base duration-500 ease-in-out rounded-md cursor-pointer disabled:cursor-not-allowed',
        variant === 'primary' && 'text-white bg-[#0f2b92] hover:bg-[#ffc107]',
        variant === 'secondary' &&
          'text-[#00145d] bg-[#cfd4e5] hover:bg-[#c2cbe5]',
        className,
      )}
      disabled={isPending}
      {...rest}
    >
      {isPending ? <Loader2 className="animate-spin" /> : title}
      {children}
    </button>
  )
}
