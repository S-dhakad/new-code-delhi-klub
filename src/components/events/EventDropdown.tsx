'use client';

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Calendar, X, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEventForm } from 'src/hooks/useEventForm';

/**
 * Event Dropdown Component
 * Provides a dropdown menu to create new events
 * Uses custom hook for form management
 */
export default function EventDropdown({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Use custom hook for form management
  const {
    formData,
    isSubmitting,
    communityMembers,
    updateField,
    handleSubmit,
    resetForm,
    fetchCommunityMembers,
  } = useEventForm(() => {
    setIsOpen(false);
    onSuccess?.();
  });

  // Fetch community members when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchCommunityMembers();
    }
  }, [isOpen]);

  /**
   * Handle form submission
   */
  const handleFormSubmit = async () => {
    await handleSubmit();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#0A5DBC] text-white py-2 px-3 rounded-[10px] h-[40px] text-base font-semibold hover:bg-[#053875] transition-colors duration-300">
          + Add event
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="p-[30px] rounded-[20px] shadow-lg w-[380px] space-y-5 border border-[#ECECEC]"
        align="end"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#787878]">
            Enter Event details
          </h3>
          <button
            className="p-1 rounded-full hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm font-medium text-[#959494] mb-0">
                Name
              </label>
              <Image src="/text.svg" alt="text icon" width={18} height={18} />
              <Input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="!border-0 !shadow-none p-0 bg-transparent text-base font-medium"
                placeholder="Enter event name"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm font-medium text-[#959494] mb-0">
                Date
              </label>
              <Calendar className="h-5 w-5 text-slate-400" />
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="border-0 shadow-none p-0 bg-transparent text-base font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                placeholder="Wednesday, 10 June 2025"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm font-medium text-[#959494] mb-0">
                Time
              </label>
              <Image src="/clock.svg" alt="text icon" width={18} height={18} />
              <Input
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className="!border-0 !shadow-none p-0 bg-transparent text-base font-medium"
                placeholder="7:00 AM - 8:00 AM"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <div className="relative rounded-[12px] border border-[#ECECEC] px-3 py-2">
              {/* floating label */}
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-slate-400 select-none">
                Type
              </label>

              <div className="flex items-center gap-3">
                <Image
                  src="/refresh-2.svg"
                  alt="text icon"
                  width={18}
                  height={18}
                />
                <div className="relative flex-1">
                  <select
                    value={formData.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full appearance-none bg-transparent border-0 p-0 pl-0 pr-8 text-base font-medium focus:outline-none"
                    aria-label="Event type"
                  >
                    <option value="Recurring">Recurring</option>
                    <option value="Non-recurring">Non-recurring</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm font-medium text-[#959494] mb-0">
                Location
              </label>
              <MapPin className="h-5 w-5 text-slate-400" />
              <Input
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="!border-0 !shadow-none p-0 bg-transparent text-base font-medium"
                placeholder="Enter event location"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="relative rounded-xl border border-slate-200 p-3">
              <label className="absolute top-[-11px] bg-white block text-sm font-medium text-[#959494] mb-0">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="!border-0 !shadow-none p-0 bg-transparent text-sm leading-6 h-28 resize-none"
                placeholder="Enter event description"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#0A5DBC] text-white rounded-[15px] font-medium text-sm  py-3 disabled:opacity-50 h-11 hover:bg-[#053875] transition-colors duration-300"
        >
          {isSubmitting ? 'Creating...' : 'Schedule & Send'}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
