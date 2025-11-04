'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';

export type LessonItem = {
  title: string;
  ctaText?: string; // e.g. "Start"
  disabled?: boolean;
};

export type ModuleItem = {
  title: string;
  durationText: string; // e.g. "28m to complete"
  description?: string;
  lessons?: LessonItem[];
  defaultOpen?: boolean;
};

export type AccordionV3Props = {
  modules: ModuleItem[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LessonRow({
  title,
  ctaText = 'Start',
  disabled: _disabled,
}: LessonItem) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Image src="/play-outline.svg" alt="lesson" width={16} height={16} />
        <span className="text-text-secondary">{title}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="bg-white text-primary border-none size-xs"
      >
        {ctaText}
      </Button>
    </div>
  );
}

export default function AccordionV3({ modules }: AccordionV3Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-[20px] overflow-hidden">
      {modules.map((m, idx) => {
        const open = openIndex === idx;
        return (
          <div
            key={idx}
            className="border-b last:border-b-0 border-[#E6E6E6] bg-white overflow-hidden"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : idx)}
              aria-expanded={open}
              aria-controls={`module-panel-${idx}`}
              className="w-full p-5 text-left flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-semibold">{m.title}</div>
                <div className="mt-2 text-sm text-text-secondary">
                  {m.durationText}m to complete
                </div>
              </div>
              <Chevron open={open} />
            </button>

            {/* Body */}
            {open && (
              <div className="p-5 bg-[#F6F6F6]" id={`module-panel-${idx}`}>
                {m.description && (
                  <p className="text-sm font-semibold">{m.description}</p>
                )}
                {m.lessons && m.lessons.length > 0 && (
                  <div className="mt-4 px-4 flex flex-col gap-2.5">
                    {m.lessons.map((lesson, i) => (
                      <LessonRow key={i} {...lesson} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
