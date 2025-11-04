/**
 * Custom hook for managing events list and fetching
 * Handles fetching events based on active tab/filter
 * Shared between desktop and mobile implementations
 */

import { useState, useEffect, useCallback } from 'react';
import { Event, EventStatus } from 'src/types/events.types';
import { eventsService } from 'src/axios/events/eventsApi';
import { useCommunityStore } from 'src/store/community.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export type EventFilter = 'all' | 'today' | 'completed' | 'cancelled';

export interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  activeTab: EventFilter;
  setActiveTab: (tab: EventFilter) => void;
  fetchEvents: () => Promise<void>;
  refetchEvents: () => Promise<void>;
}

/**
 * Hook for managing events list
 * @returns {UseEventsReturn} Events data and control functions
 */
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<EventFilter>('all');
  const { community } = useCommunityStore();
  const showToast = useToastStore((s) => s.showToast);

  /**
   * Fetch events based on the active tab/filter
   * @param {EventFilter} tab - The filter tab to fetch events for
   */
  const fetchEvents = useCallback(
    async (tab?: EventFilter) => {
      const currentTab = tab || activeTab;

      // If no community is selected, don't fetch events for community-specific tabs
      if (
        !community?.id &&
        (currentTab === 'all' ||
          currentTab === 'completed' ||
          currentTab === 'cancelled')
      ) {
        setEvents([]);
        return;
      }

      setLoading(true);
      try {
        let response;

        switch (currentTab) {
          case 'all':
            // Fetch all events for the community
            response = await eventsService.getEvents(community!.id, {
              sort: 'latest',
              limit: 10,
              page: 1,
            });
            break;

          case 'today':
            // Fetch today's events across all communities
            response = await eventsService.getAllEventsToday(community!.id, {
              sort: 'latest',
              limit: 10,
              page: 1,
            });
            break;

          case 'completed':
            // Fetch completed events
            response = await eventsService.getEventsByStatus(
              community!.id,
              EventStatus.PAST,
              {
                sort: 'latest',
                limit: 10,
                page: 1,
              },
            );
            break;

          case 'cancelled':
            // Fetch cancelled events
            response = await eventsService.getEventsByStatus(
              community!.id,
              EventStatus.CANCELLED,
              {
                sort: 'latest',
                limit: 10,
                page: 1,
              },
            );
            break;

          default:
            response = { data: { events: [] } };
        }

        // Set events from API response
        setEvents(response.data?.events || []);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error fetching events',
          message,
        });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, community, showToast],
  );

  /**
   * Refetch events for the current active tab
   */
  const refetchEvents = useCallback(async () => {
    await fetchEvents(activeTab);
  }, [fetchEvents, activeTab]);

  // Fetch events when activeTab or community changes
  useEffect(() => {
    fetchEvents();
  }, [activeTab, fetchEvents]);

  return {
    events,
    loading,
    activeTab,
    setActiveTab,
    fetchEvents: refetchEvents,
    refetchEvents,
  };
}
