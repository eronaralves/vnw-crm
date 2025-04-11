import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  children?: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({
  title,
  children,
  variant = 'primary',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 px-4 py-2 font-bold text-base duration-500 ease-in-out rounded-md cursor-pointer',
        variant === 'primary' && 'text-white bg-[#0f2b92] hover:bg-[#ffc107]',
        variant === 'secondary' &&
          'text-[#00145d] bg-[#cfd4e5] hover:bg-[#c2cbe5]',
        className,
      )}
      {...rest}
    >
      {title}
      {children}
    </button>
  )
}
