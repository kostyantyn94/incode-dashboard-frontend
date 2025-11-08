// src/components/ui/Badge.tsx

import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?:
    | 'low'
    | 'medium'
    | 'high'
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = 'default', size = 'md', className = '', ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200'

    const variantStyles = {
      default: 'bg-gray-100 text-gray-700',
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-orange-100 text-orange-700',
      danger: 'bg-red-100 text-red-700',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
