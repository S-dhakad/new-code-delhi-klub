'use client';
import React, { useState } from 'react';
import { useCommunityStore } from 'src/store/community.store';

export const eventFilters = [
  'Profile',
  'Communities',
  'Account',
  'Payments & Invoices',
  'Help & Support',
] as const;
export type Filter = (typeof eventFilters)[number];

type Props = {
  value?: Filter;
  onChange?: (value: Filter) => void;
  className?: string;
};

const EditProfileTab: React.FC<Props> = ({ value, onChange, className }) => {
  const [internal, setInternal] = useState<Filter>('Profile');
  const { userCommunity } = useCommunityStore();
  const selected = value ?? internal;
  const setSelected = (val: Filter) => {
    if (!value) setInternal(val);
    onChange?.(val);
  };

  // Filter out Communities tab for MEMBER role
  const availableFilters = eventFilters.filter(
    (filter) => !(userCommunity?.role === 'MEMBER' && filter === 'Communities'),
  );

  return (
    <div
      className={`flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 rounded-2xl bg-white ${className ?? ''}`}
      role="tablist"
      aria-label="Event filters"
    >
      {availableFilters.map((filter) => {
        const isActive = selected === filter;
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={isActive}
            onClick={() => setSelected(filter)}
            className={`rounded-[10px] px-5 py-[10px] text-base whitespace-nowrap transition-colors cursor-pointer select-none
              ${
                isActive
                  ? 'text-primary font-semibold bg-secondary'
                  : 'text-text-secondary font-medium bg-white'
              }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default EditProfileTab;
