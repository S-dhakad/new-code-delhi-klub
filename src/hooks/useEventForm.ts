/**
 * Custom hook for managing event form state
 * Handles form data, validation, and submission
 * Shared between desktop and mobile implementations
 */

import { useState, useEffect } from 'react';
import { Event } from 'src/types/events.types';
import { eventsService } from 'src/axios/events/eventsApi';
import { communityService } from 'src/axios/community/communityApi';
import { useCommunityStore } from 'src/store/community.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { calculateDuration } from 'src/utils/calculateDuration';
import { convertToUTC } from 'src/utils/convertToUTC';

export interface EventFormData {
  name: string;
  date: string;
  time: string;
  type: 'Recurring' | 'Non-recurring';
  location: string;
  description: string;
}

export interface UseEventFormReturn {
  formData: EventFormData;
  isSubmitting: boolean;
  communityMembers: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }>;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  updateField: (field: keyof EventFormData, value: string) => void;
  handleSubmit: () => Promise<boolean>;
  handleUpdate: (eventId: string) => Promise<boolean>;
  resetForm: () => void;
  loadEventData: (event: Event) => void;
  fetchCommunityMembers: () => Promise<void>;
}

const initialFormData: EventFormData = {
  name: '',
  date: '',
  time: '',
  type: 'Recurring',
  location: '',
  description: '',
};

/**
 * Hook for managing event form state and operations
 * @param {Function} onSuccess - Callback function to call on successful submission
 * @returns {UseEventFormReturn} Form data and control functions
 */
export function useEventForm(onSuccess?: () => void): UseEventFormReturn {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityMembers, setCommunityMembers] = useState<
    Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    }>
  >([]);

  const { community } = useCommunityStore();
  const showToast = useToastStore((s) => s.showToast);

  /**
   * Update a single form field
   * @param {keyof EventFormData} field - The field to update
   * @param {string} value - The new value
   */
  const updateField = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(initialFormData);
  };

  /**
   * Load event data into form (for editing)
   * @param {Event} event - The event to load
   */
  const loadEventData = (event: Event) => {
    if (!event) return;

    let dateStr = '';
    let timeStr = '';

    if (event.date) {
      try {
        const d = new Date(event.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateStr = `${yyyy}-${mm}-${dd}`;

        timeStr = d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      } catch {
        dateStr = '';
        timeStr = '';
      }
    }

    setFormData({
      name: event.name ?? '',
      date: dateStr,
      time: timeStr,
      type: event.recurring ? 'Recurring' : 'Non-recurring',
      location: event.location ?? '',
      description: event.description ?? '',
    });
  };

  /**
   * Fetch community members for attendee selection
   */
  const fetchCommunityMembers = async () => {
    if (!community?.id) return;

    try {
      const response = await communityService.getCommunityMembers(community.id);
      setCommunityMembers(response.data?.members || []);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to load members',
        message,
      });
      setCommunityMembers([]);
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = (): boolean => {
    if (!community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot create event. Missing required fields.',
      });
      return false;
    }

    if (
      !formData.name.trim() ||
      !formData.date.trim() ||
      !formData.time.trim()
    ) {
      showToast({
        type: 'default-error',
        title: 'Please fill in all required fields.',
      });
      return false;
    }

    return true;
  };

  /**
   * Build event payload from form data
   * @returns {object | null} Event payload or null if invalid
   */
  const buildPayload = () => {
    const duration = calculateDuration(formData.time);
    const utcDate = convertToUTC(formData.date, formData.time);

    if (!utcDate) {
      showToast({
        type: 'default-error',
        title: 'Invalid date or time format. Please check your inputs.',
      });
      return null;
    }

    // Extract attendee emails from community members
    const attendeeEmails = communityMembers
      .map((member) => member.email)
      .filter((email) => email);

    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration,
      date: utcDate,
      recurring: formData.type === 'Recurring',
      location: formData.location.trim() || undefined,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      attendeeEmails,
    };
  };

  /**
   * Handle form submission for creating a new event
   * @returns {Promise<boolean>} True if submission was successful
   */
  const handleSubmit = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    const payload = buildPayload();
    if (!payload) return false;

    setIsSubmitting(true);

    try {
      const response = await eventsService.createEvent(community!.id, payload);
      showToast({
        type: 'default-success',
        title: 'Event created successfully',
      });

      resetForm();
      onSuccess?.();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create event',
        message,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form submission for updating an existing event
   * @param {string} eventId - The ID of the event to update
   * @returns {Promise<boolean>} True if update was successful
   */
  const handleUpdate = async (eventId: string): Promise<boolean> => {
    if (!validateForm()) return false;

    if (!eventId) {
      showToast({
        type: 'default-error',
        title: 'Missing event id for update.',
      });
      return false;
    }

    const payload = buildPayload();
    if (!payload) return false;

    // Remove attendeeEmails for update (not supported in update API)
    const { attendeeEmails, ...updatePayload } = payload;

    setIsSubmitting(true);

    try {
      await eventsService.updateEvent(community!.id, eventId, updatePayload);

      showToast({
        type: 'default-success',
        title: 'Event updated successfully',
      });

      onSuccess?.();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update event',
        message,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    communityMembers,
    setFormData,
    updateField,
    handleSubmit,
    handleUpdate,
    resetForm,
    loadEventData,
    fetchCommunityMembers,
  };
}
