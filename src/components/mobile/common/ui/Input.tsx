'use client';

import React from 'react';

export type MobileInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
};

export type MobileTextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> & {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
};

function Label({ text, htmlFor }: { text?: string; htmlFor?: string }) {
  if (!text) return null;
  return (
    <label htmlFor={htmlFor} className="mb-1.5 text-sm font-medium text-black">
      {text}
    </label>
  );
}

function Hint({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs text-text-secondary">{text}</p>;
}

function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs text-[#DE0000]">{text}</p>;
}

const baseFieldClasses =
  'w-full rounded-2xl ring-0 border border-[#ECECEC] bg-white px-4 py-2.5 text-base text-black placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed';

export function Input({
  label,
  hint,
  error,
  id,
  fullWidth = true,
  className = '',
  ...props
}: MobileInputProps) {
  const width = fullWidth ? 'w-full' : '';
  const errorRing = error ? 'border-[#DE0000] focus:ring-[#DE0000]/10' : '';
  const classes = [baseFieldClasses, width, errorRing, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="flex flex-col">
        <Label text={label} htmlFor={id} />
        <input id={id} className={classes} {...props} />
      </div>
      {error ? <ErrorText text={error} /> : <Hint text={hint} />}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  error,
  id,
  rows = 4,
  fullWidth = true,
  className = '',
  ...props
}: MobileTextAreaProps) {
  const width = fullWidth ? 'w-full' : '';
  const errorRing = error ? 'border-[#DE0000] focus:ring-[#DE0000]/10' : '';
  const classes = [
    baseFieldClasses,
    'min-h-[120px] resize-y border-[#ECECEC] border focus:border-primary focus:ring-2 focus:ring-primary/10',
    width,
    errorRing,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="flex flex-col">
        <Label text={label} htmlFor={id} />
        <textarea id={id} rows={rows} className={classes} {...props} />
      </div>
      {error ? <ErrorText text={error} /> : <Hint text={hint} />}
    </div>
  );
}

export default Input;

// Floating pill input with inline label and optional left icon
// API is kept simple to match the provided design snippet
export type FloatingInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  id: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
};

export function FloatingInput({
  id,
  label,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-medium text-text-secondary"
      >
        {label}
      </label>
      <div className="flex items-center gap-[10px] rounded-2xl border px-[20px] py-3 bg-white">
        {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
        <input
          id={id}
          className={[
            'flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-text-secondary border-0 p-0',
            className,
          ].join(' ')}
          {...props}
        />
        {rightIcon ? <span className="shrink-0 pr-1">{rightIcon}</span> : null}
      </div>
    </div>
  );
}

// FloatingSelect: pill select with same UI as FloatingInput
export type FloatingSelectOption = { label: string; value: string };
export type FloatingSelectProps = {
  id: string;
  label: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options: FloatingSelectOption[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  className?: string;
};

export function FloatingSelect({
  id,
  label,
  value,
  onChange,
  options,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
}: FloatingSelectProps) {
  return (
    <div className={[containerClassName].filter(Boolean).join(' ')}>
      <div className="relative w-full">
        <label
          htmlFor={id}
          className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
        <div className="flex items-center gap-[10px] rounded-2xl border px-[20px] py-3 bg-white">
          {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
          <select
            id={id}
            value={value}
            onChange={onChange}
            className={[
              'flex-1 bg-transparent text-sm font-medium outline-none border-0 p-0 appearance-none',
              className,
            ].join(' ')}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {rightIcon ? (
            <span className="shrink-0 pr-1">{rightIcon}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// FloatingTextArea: pill-like container with floating label for multiline input
export type FloatingTextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> & {
  id: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  className?: string;
};

export function FloatingTextArea({
  id,
  label,
  leftIcon,
  rightIcon,
  rows = 4,
  containerClassName = '',
  className = '',
  ...props
}: FloatingTextAreaProps) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="absolute -top-2.5 left-4 bg-white px-1.5 text-sm font-medium text-text-secondary"
      >
        {label}
      </label>
      <div className="flex items-start gap-[10px] rounded-2xl border px-[20px] py-4 bg-white">
        {leftIcon ? <span className="shrink-0 mt-1">{leftIcon}</span> : null}
        <textarea
          id={id}
          rows={rows}
          className={[
            'flex-1 bg-transparent text-sm font-medium outline-none border-0 p-0 resize-y',
            className,
          ].join(' ')}
          {...props}
        />
        {rightIcon ? (
          <span className="shrink-0 pr-1 mt-1">{rightIcon}</span>
        ) : null}
      </div>
    </div>
  );
}
