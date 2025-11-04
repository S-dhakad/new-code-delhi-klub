'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import {
  FloatingInput,
  FloatingTextArea,
} from 'src/components/mobile/common/ui/Input';
import { useEventForm } from 'src/hooks/useEventForm';
import { Event } from 'src/types/events.types';

// Icons
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
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="#0A0A0A"
      strokeWidth="1.6"
    />
    <path d="M8 2v4M16 2v4M3 10h18" stroke="#0A0A0A" strokeWidth="1.6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="#0A0A0A" strokeWidth="1.6" />
    <path d="M12 7v5l3 3" stroke="#0A0A0A" strokeWidth="1.6" />
  </svg>
);

const RepeatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M17 2l4 4-4 4M7 22l-4-4 4-4"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 6H9a6 6 0 00-6 6v2M3 18h12a6 6 0 006-6v-2"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke="#0A0A0A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9" r="2.5" stroke="#0A0A0A" strokeWidth="1.6" />
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

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * Mobile Edit Event Form Component
 * Full-screen form for editing existing events on mobile
 * Uses custom hook for form management and pre-populates with event data
 */
const EditEventForm: React.FC<Props> = ({ event, onClose, onSuccess }) => {
  // Use custom hook for form management
  const { formData, isSubmitting, updateField, handleUpdate, loadEventData } =
    useEventForm(() => {
      onClose();
      onSuccess?.();
    });

  // Load event data on mount
  useEffect(() => {
    if (event) {
      loadEventData(event);
    }
  }, [event]);

  /**
   * Handle form submission for update
   */
  const onSubmit = async () => {
    if (!event?.id) return;
    await handleUpdate(event.id);
  };

  return (
    <div className="mx-auto max-w-[430px] px-4 py-7 bg-white min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between text-text-secondary pt-1.5 pb-4 border-b-2">
        <h2 className="font-medium">Edit Basic info</h2>
        <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-3 py-5">
        {/* Name */}
        <FloatingInput
          id="event-name"
          label="Name"
          leftIcon={<NameIcon />}
          placeholder="Event name"
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

        {/* Location */}
        <FloatingInput
          id="event-location"
          label="Location"
          leftIcon={<LocationIcon />}
          placeholder="Event location"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
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
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;
