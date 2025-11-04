import React from 'react';

export type ModuleItem = {
  title: string;
  durationText: string; // e.g. "28m to complete"
  description?: string;
  ctaText?: string; // e.g. "Start"
};

export type ContentAccordionProps = {
  modules: ModuleItem[];
  title?: string;
};

export default function ContentAccordion({
  modules,
  title = 'Course content',
}: ContentAccordionProps) {
  return (
    <section className="mt-6">
      <h2 className="text-base font-medium">{title}</h2>
      <div className="mt-3 space-y-3">
        {modules.map((mod, i) => (
          <details
            key={i}
            className="rounded-2xl border border-[#E6E6E6] bg-white"
          >
            <summary className="list-none cursor-pointer rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{mod.title}</div>
                <div className="text-xs text-text-secondary">
                  {mod.durationText}
                </div>
              </div>
              {mod.ctaText && (
                <button className="ml-3 inline-flex items-center rounded-[10px] bg-primary text-white px-3 py-1.5 text-xs font-semibold">
                  {mod.ctaText}
                </button>
              )}
            </summary>
            {mod.description && (
              <div className="px-4 pb-4">
                <p className="text-sm text-text-secondary">{mod.description}</p>
              </div>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
