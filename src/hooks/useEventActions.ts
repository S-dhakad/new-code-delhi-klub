/**
 * Custom hook for event-related actions
 * Handles operations like cancel, delete, join, etc.
 * Shared between desktop and mobile implementations
 */

import { useState } from 'react';
import { Event, EventStatus } from 'src/types/events.types';
import { eventsService } from 'src/axios/events/eventsApi';
import { useCommunityStore } from 'src/store/community.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export interface UseEventActionsReturn {
  cancellingEventId: string | null;
  isCancelling: boolean;
  cancelEvent: (eventId: string) => Promise<boolean>;
  joinEvent: (event: Event) => void;
}

/**
 * Hook for managing event actions
 * @param {Function} onSuccess - Callback function to call after successful action
 * @returns {UseEventActionsReturn} Event action functions
 */
export function useEventActions(onSuccess?: () => void): UseEventActionsReturn {
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);

  const { community } = useCommunityStore();
  const showToast = useToastStore((s) => s.showToast);

  /**
   * Cancel an event
   * @param {string} eventId - The ID of the event to cancel
   * @returns {Promise<boolean>} True if cancellation was successful
   */
  const cancelEvent = async (eventId: string): Promise<boolean> => {
    if (!community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot cancel event. Community not found.',
      });
      return false;
    }

    if (!eventId) {
      showToast({
        type: 'default-error',
        title: 'Cannot cancel event. Event ID not found.',
      });
      return false;
    }

    setCancellingEventId(eventId);
    setIsCancelling(true);

    try {
      // Update event status to CANCELLED
      await eventsService.updateEvent(community.id, eventId, {
        status: EventStatus.CANCELLED,
      });

      showToast({
        type: 'default-success',
        title: 'Event cancelled successfully',
      });

      onSuccess?.();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to cancel event',
        message,
      });
      return false;
    } finally {
      setIsCancelling(false);
      setCancellingEventId(null);
    }
  };

  /**
   * Join an event (open meet link)
   * @param {Event} event - The event to join
   */
  const joinEvent = (event: Event) => {
    if (!event.meetLink) {
      showToast({
        type: 'default-error',
        title: 'Meet link not available',
        message: 'This event does not have a meeting link yet.',
      });
      return;
    }

    // Open meet link in new tab
    window.open(event.meetLink, '_blank');
  };

  return {
    cancellingEventId,
    isCancelling,
    cancelEvent,
    joinEvent,
  };
}
