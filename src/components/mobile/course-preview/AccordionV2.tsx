import React, { useState } from 'react';
import Image from 'next/image';

export type LessonItem = {
  title: string;
  ctaText?: string; // e.g. "Start"
  disabled?: boolean;
};

export type ModuleV2 = {
  title: string;
  durationText: string;
  description?: string;
  lessons?: LessonItem[];
  defaultOpen?: boolean;
};

export type AccordionV2Props = {
  modules: ModuleV2[];
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
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LessonRow({ title, ctaText = 'Start', disabled }: LessonItem) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#EFEFEF] last:border-b-0">
      <div className="flex items-center gap-2 text-sm">
        <Image src="/play-outline.svg" alt="lesson" width={18} height={18} />
        <span
          className={`font-medium ${disabled ? 'text-[#A0A0A0]' : 'text-[#2A2A2A]'}`}
        >
          {title}
        </span>
      </div>
      <button
        type="button"
        disabled={disabled}
        aria-label={ctaText}
        className={`px-2.5 py-1 rounded-xl text-xs font-semibold shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${
          disabled ? 'bg-[#F2F2F2] text-[#A0A0A0]' : 'bg-white text-primary'
        }`}
      >
        {ctaText}
      </button>
    </div>
  );
}

export default function AccordionV2({ modules }: AccordionV2Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {modules.map((m, idx) => {
        const open = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-[#E6E6E6] bg-white overflow-hidden"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : idx)}
              aria-expanded={open}
              aria-controls={`module-panel-${idx}`}
              className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="text-[15px] font-semibold leading-5">
                  {m.title}
                </div>
                <div className="mt-1 text-xs text-[#7D7D7D]">
                  {m.durationText}
                </div>
              </div>
              <Chevron open={open} />
            </button>

            {/* Body */}
            {open && (
              <div className="px-4 pb-4" id={`module-panel-${idx}`}>
                {m.description && (
                  <>
                    <div className="h-px bg-[#EDEDED] -mt-1 mb-3" />
                    <p className="text-sm text-[#3D3D3D] leading-6">
                      {m.description}
                    </p>
                  </>
                )}
                {m.lessons && m.lessons.length > 0 && (
                  <div className="mt-3">
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
