import React from 'react';

export type FieldSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FieldSection({
  title,
  description,
  children,
  className,
}: FieldSectionProps) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      <div className="flex flex-col gap-1">
        <label className="font-semibold">{title}</label>
        {description ? (
          <p className="text-text-secondary text-sm font-medium">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
