'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import React from 'react';

type Props = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: number;
  bgChecked?: string;
  bgUnchecked?: string;
  tickColorChecked?: string;
  outlineColorUnchecked?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export default function CustomShadcnCheckbox({
  checked,
  onCheckedChange,
  size = 24,
  bgChecked = '#10B981',
  bgUnchecked = '#FFFFFF',
  tickColorChecked = '#FFFFFF',
  outlineColorUnchecked = 'rgba(0,0,0,0.12)',
  className = '',
  disabled = false,
  ariaLabel,
}: Props) {
  const wrapperStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: 4,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const innerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 4,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: checked ? bgChecked : bgUnchecked,
    transition:
      'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease',
    boxSizing: 'border-box',
    border: checked ? 'none' : `1px solid ${outlineColorUnchecked}`,
  };

  const svgSize = Math.round(size * 0.6);
  const strokeWidth = Math.max(2, Math.round(size * 0.11));

  return (
    <div style={wrapperStyle} className={className} aria-hidden={disabled}>
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={(v) => onCheckedChange?.(!!v)}
        disabled={disabled}
        aria-label={ariaLabel}
        style={innerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          aria-hidden
          style={{ display: 'block' }}
        >
          <polyline
            points="20 7 10 17 4 11"
            fill="none"
            stroke={outlineColorUnchecked}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={checked ? 0 : 1}
          />

          <polyline
            points="20 7 10 17 4 11"
            fill="none"
            stroke={tickColorChecked}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={checked ? 1 : 0}
          />
        </svg>
      </CheckboxPrimitive.Root>
    </div>
  );
}
