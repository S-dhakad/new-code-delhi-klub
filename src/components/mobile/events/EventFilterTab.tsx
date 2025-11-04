'use client';
import React from 'react';
import type { EventFilter } from 'src/hooks/useEvents';

/**
 * Mobile Event Filter Tab Component
 * Displays filter tabs for events (All, Today, Completed, Cancelled)
 */
interface EventFilterTabProps {
  activeTab: EventFilter;
  onTabChange: (tab: EventFilter) => void;
}

const EventFilterTab: React.FC<EventFilterTabProps> = ({
  activeTab,
  onTabChange,
}) => {
  const eventFilters: { label: string; value: EventFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div
      className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 rounded-2xl bg-white"
      role="tablist"
      aria-label="Event filters"
    >
      {eventFilters.map((filter) => {
        const isActive = activeTab === filter.value;
        return (
          <button
            key={filter.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(filter.value)}
            className={`rounded-[10px] px-5 py-[10px] text-base whitespace-nowrap transition-colors cursor-pointer select-none
              ${
                isActive
                  ? 'text-primary font-semibold bg-secondary'
                  : 'text-text-secondary font-medium bg-white'
              }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default EventFilterTab;
