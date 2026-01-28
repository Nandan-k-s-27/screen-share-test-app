'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

/**
 * Reusable Button component with loading state, variants, and enhanced interactions
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Base styles with enhanced transitions and touch feedback
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    cursor-pointer select-none
    transform hover:scale-[1.02] active:scale-[0.98]
    shadow-sm hover:shadow-md
    touch-manipulation
  `;

  // Size variants with responsive padding
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  };

  // Color variants with gradient and enhanced hover states
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white
      hover:from-blue-700 hover:to-blue-800
      focus:ring-blue-500
      active:from-blue-800 active:to-blue-900
      shadow-blue-500/25 hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700 text-white
      hover:from-gray-700 hover:to-gray-800
      focus:ring-gray-500
      active:from-gray-800 active:to-gray-900
      shadow-gray-500/25 hover:shadow-gray-500/40
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700
      focus:ring-red-500
      active:from-red-700 active:to-red-800
      shadow-red-500/25 hover:shadow-red-500/40
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 text-white
      hover:from-green-600 hover:to-green-700
      focus:ring-green-500
      active:from-green-700 active:to-green-800
      shadow-green-500/25 hover:shadow-green-500/40
    `,
    outline: `
      bg-transparent text-blue-600 border-2 border-blue-500
      hover:bg-blue-50 hover:border-blue-600
      focus:ring-blue-500
      active:bg-blue-100
      dark:text-blue-400 dark:border-blue-400
      dark:hover:bg-blue-950 dark:hover:border-blue-300
    `,
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedStyles = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${widthStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const iconElement = icon && (
    <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
      {icon}
    </span>
  );

  return (
    <button
      className={`group ${combinedStyles}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {iconPosition === 'left' && iconElement}
          <span>{children}</span>
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </button>
  );
}
