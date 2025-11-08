// src/components/ui/Input.tsx

import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', id, ...props }, ref) => {
    const inputId =
      id ||
      (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    const baseStyles =
      'px-4 py-2 border rounded-lg text-gray-800 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 hover:border-gray-400'

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${errorStyles} ${widthStyle} ${className}`}
          {...props}
        />

        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
