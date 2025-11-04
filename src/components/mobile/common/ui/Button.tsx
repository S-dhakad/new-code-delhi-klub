'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export type MobileButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-[#F6F6F6] text-black border-[0.5px] border-[#ECECEC] hover:bg-[#F7F7F7] active:bg-[#F0F0F0] disabled:opacity-60 disabled:cursor-not-allowed',
  destructive:
    'bg-[#DE0000] text-white hover:brightness-110 active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed',
  outline:
    'border-[0.5px] border-[#ECECEC] hover:bg-[#F7F7F7] active:bg-[#F0F0F0] disabled:opacity-60 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2.5 text-sm font-medium rounded-[10px]',
  md: 'px-4 py-3 text-base font-medium rounded-[15px]',
  lg: 'px-5 py-2.5 text-base font-medium rounded-[15px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: MobileButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-colors select-none';
  const width = fullWidth ? 'w-full' : '';
  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    width,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
