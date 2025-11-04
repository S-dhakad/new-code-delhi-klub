'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import {
  FloatingInput,
  FloatingTextArea,
} from 'src/components/mobile/common/ui/Input';
import { useEventForm } from 'src/hooks/useEventForm';

// Icons needs to be changed
const NameIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 17h12M8 7h8M8 11h8"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="3.5"
      y="5.5"
      width="17"
      height="15"
      rx="2.5"
      stroke="#0A0A0A"
      strokeWidth="1.6"
    />
    <path
      d="M7 3.5v4"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M17 3.5v4"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M3.5 9.5h17" stroke="#0A0A0A" strokeWidth="1.6" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="8.4" stroke="#0A0A0A" strokeWidth="1.6" />
    <path
      d="M12 7.5v5l3 2"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const RepeatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 7h10a4 4 0 014 4v0"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M8 3l-4 4 4 4"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 17H10a4 4 0 01-4-4v0"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16 21l4-4-4-4"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 9l6 6 6-6"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Props = { onClose: () => void };

/**
 * Mobile Add Event Form Component
 * Full-screen form for creating new events on mobile
 * Uses custom hook for form management
 */
const AddEventForm: React.FC<Props> = ({ onClose }) => {
  // Use custom hook for form management
  const {
    formData,
    isSubmitting,
    communityMembers,
    updateField,
    handleSubmit,
    fetchCommunityMembers,
  } = useEventForm(onClose);

  // Fetch community members on mount
  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async () => {
    await handleSubmit();
  };

  return (
    <div className="mx-auto max-w-[430px] px-4 py-7 bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between text-text-secondary pt-1.5 pb-4 border-b-2">
        <h2 className="font-medium">Edit Basic info</h2>
        <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>

      {/* Form fields */}
      <div className="mt-7 flex flex-col gap-7">
        {/* Name */}
        <FloatingInput
          id="event-name"
          label="Name"
          leftIcon={<NameIcon />}
          placeholder="Weekly Catchup with AI Builders"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          containerClassName="mt-3"
        />

        {/* Date */}

        <FloatingInput
          id="event-date"
          label="Date"
          leftIcon={<CalendarIcon />}
          placeholder="YYYY-MM-DD"
          type="date"
          value={formData.date}
          onChange={(e) => updateField('date', e.target.value)}
          containerClassName="mt-3"
        />

        {/* Time */}

        <FloatingInput
          id="event-time"
          label="Time"
          leftIcon={<ClockIcon />}
          placeholder="7:00 AM - 8:00 AM"
          value={formData.time}
          onChange={(e) => updateField('time', e.target.value)}
          containerClassName="mt-3"
        />

        {/* Type */}

        <FloatingInput
          id="event-type"
          label="Type"
          leftIcon={<RepeatIcon />}
          rightIcon={<ChevronDown />}
          placeholder="Recurring"
          value={formData.type}
          onChange={(e) => updateField('type', e.target.value)}
          containerClassName="mt-3"
        />

        {/* Description */}
        <FloatingTextArea
          id="event-description"
          label="Description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="border-0 focus:ring-0 focus:border-0"
          rows={5}
          placeholder="Enter event description"
        />

        {/* Save CTA */}
        <div className="-mt-3">
          <Button
            variant="primary"
            size="lg"
            className="text-sm"
            fullWidth
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Save & Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;
