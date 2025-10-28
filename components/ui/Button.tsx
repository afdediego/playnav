'use client';

/**
 * Retro-styled button component
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-pixel font-bold uppercase transition-all duration-150 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed retro-text';

  const variantClasses = {
    primary:
      'bg-retro-cyan text-black border-retro-cyan hover:bg-transparent hover:text-retro-cyan focus:ring-retro-cyan active:scale-95',
    secondary:
      'bg-transparent text-retro-purple border-retro-purple hover:bg-retro-purple hover:text-black focus:ring-retro-purple active:scale-95',
    danger:
      'bg-retro-pink text-white border-retro-pink hover:bg-transparent hover:text-retro-pink focus:ring-retro-pink active:scale-95',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-6 py-2 text-sm',
    large: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


