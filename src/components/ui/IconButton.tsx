// src/components/ui/IconButton.tsx

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  variant?: 'default' | 'danger' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel: string
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'default',
      size = 'md',
      ariaLabel,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex cursor-pointer items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      default:
        'text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-300 active:bg-gray-200',
      danger:
        'text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-300 active:bg-red-100',
      primary:
        'text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-300 active:bg-blue-100',
    }

    const sizeStyles = {
      sm: 'p-1 text-sm',
      md: 'p-2 text-base',
      lg: 'p-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        aria-label={ariaLabel}
        title={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
