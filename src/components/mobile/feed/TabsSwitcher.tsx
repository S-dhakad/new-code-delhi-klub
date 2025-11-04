'use client';

import React, { useMemo, useState } from 'react';

export type TabItem = {
  title: string;
  number?: string | number;
  component: React.ReactNode;
};

type TabsSwitcherProps = {
  items: TabItem[];
  defaultIndex?: number;
};

export default function TabsSwitcher({
  items,
  defaultIndex,
}: TabsSwitcherProps) {
  const computedTabs: TabItem[] = useMemo(() => items ?? [], [items]);
  const initialIndex = Math.min(
    Math.max(defaultIndex ?? 0, 0),
    Math.max(computedTabs.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!computedTabs.length) return;
    const idx = activeIndex;
    if (e.key === 'ArrowRight') {
      const next = computedTabs[(idx + 1) % computedTabs.length];
      setActiveIndex((idx + 1) % computedTabs.length);
    } else if (e.key === 'ArrowLeft') {
      setActiveIndex((idx - 1 + computedTabs.length) % computedTabs.length);
    }
  };

  return (
    <div className="pt-5 bg-white">
      <div
        role="tablist"
        aria-label="Tabs"
        className="h-auto bg-transparent p-0 px-4 gap-12 justify-start flex"
        onKeyDown={onKeyDown}
      >
        {computedTabs.map((tab, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${idx}`}
              id={`tab-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={
                `px-0 py-0 h-auto border-none bg-transparent font-medium rounded-none shadow-none inline-flex flex-col items-start` +
                (isActive ? ' text-primary' : ' text-text-secondary')
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{tab.title}</span>
                {tab.number !== undefined && (
                  <span
                    className={
                      `text-xs leading-none px-2 py-1 rounded-md border ` +
                      (isActive
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-100 text-text-secondary border-transparent')
                    }
                  >
                    {tab.number}
                  </span>
                )}
              </div>
              {/* underline inside button to prevent spill outside container */}
              <div
                className={
                  `mt-2 h-[3px] w-full rounded-full ` +
                  (isActive ? 'bg-primary' : 'bg-transparent')
                }
              />
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pt-0">
        {computedTabs.map((tab, idx) => (
          <div
            key={idx}
            role="tabpanel"
            id={`panel-${idx}`}
            aria-labelledby={`tab-${idx}`}
            hidden={activeIndex !== idx}
            className="pt-0"
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
}
