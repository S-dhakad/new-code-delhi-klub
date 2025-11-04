'use client';

import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import type { Event } from 'src/types/events.types';
import { useEventForm } from 'src/hooks/useEventForm';

type EditEventModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  event: Event | null;
  eventId?: string;
  onSuccess?: () => void;
};

/**
 * Edit Event Modal Component
 * Allows editing of event basic info
 * Uses custom hook for form management
 */
export const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  setOpen,
  onOpenChange,
  event,
  eventId,
  onSuccess,
}) => {
  // Use custom hook for form management
  const { formData, isSubmitting, updateField, handleUpdate, loadEventData } =
    useEventForm(() => {
      setOpen(false);
      onSuccess?.();
    });

  // Load event data when modal opens
  React.useEffect(() => {
    if (event && open) {
      loadEventData(event);
    }
  }, [event, open]);

  /**
   * Handle save button click
   */
  const handleSave = async () => {
    const id = eventId ?? event?.id;
    if (!id) return;

    await handleUpdate(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogContent
        className="p-8 rounded-[30px] gap-6 w-[500px]"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-medium text-[#787878]">
            Edit Basic Info
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <Image src="/plus.svg" alt="plus icon" width={32} height={32} />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm text-slate-400 mb-0">
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
              <label className="absolute top-[-11px] bg-white block text-sm text-slate-400 mb-0">
                Date
              </label>
              <Calendar className="h-5 w-5 text-slate-400" />
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="!border-0 !shadow-none p-0 bg-transparent text-base font-medium [appearance:none] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                placeholder="Wednesday, 10 June 2025"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 p-1 px-3">
              <label className="absolute top-[-11px] bg-white block text-sm text-slate-400 mb-0">
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
                    className="w-full appearance-none bg-transparent border-0 p-0 pl-0 pr-8 text-base font-medium focus:outline-none focus:ring-0 focus:shadow-none"
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
              <label className="absolute top-[-11px] bg-white block text-sm text-slate-400 mb-0">
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
              <label className="absolute top-[-11px] bg-white block text-sm text-slate-400 mb-0">
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

          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Save & Schedule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
