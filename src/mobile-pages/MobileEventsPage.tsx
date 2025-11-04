'use client';
import React, { useState } from 'react';
import EventFilterTab from 'src/components/mobile/events/EventFilterTab';
import EventCard from 'src/components/mobile/events/EventCard';
import Button from 'src/components/mobile/common/ui/Button';
import AddEventForm from 'src/components/mobile/events/AddEventForm';
import { useEvents } from 'src/hooks/useEvents';
import { useCommunityStore } from 'src/store/community.store';
import type { EventFilter } from 'src/hooks/useEvents';

/**
 * Mobile Events Page Component
 * Displays events list with filtering tabs for mobile view
 * Uses custom hooks for events management
 */
const MobileEventsPage = () => {
  const [addEventOpen, setAddEventOpen] = useState(false);
  const { userCommunity } = useCommunityStore();

  // Use custom hook for events management
  const { events, loading, activeTab, setActiveTab, refetchEvents } =
    useEvents();

  /**
   * Handle tab change from filter component
   */
  const handleTabChange = (tab: EventFilter) => {
    setActiveTab(tab);
  };
  return (
    <>
      {addEventOpen ? (
        <AddEventForm
          onClose={() => {
            setAddEventOpen(false);
            refetchEvents();
          }}
        />
      ) : (
        <div className="mx-auto max-w-[430px] px-4 py-7 bg-[#ECECEC]">
          {/* Header with Add Event button for admins */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-semibold text-[#000000]">My Events</h1>
            {userCommunity?.role === 'ADMIN' && (
              <Button variant="primary" onClick={() => setAddEventOpen(true)}>
                + Add Event
              </Button>
            )}
          </div>

          {/* Filter tabs */}
          <EventFilterTab activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Events list */}
          <div className="mt-[30px] grid grid-cols-1 gap-5">
            {loading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSuccess={refetchEvents}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No events found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileEventsPage;
