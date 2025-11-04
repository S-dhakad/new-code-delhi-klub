'use client';

import React, { Fragment } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'src/components/ui/tabs';
import EventCard from 'src/components/events/EventCard';
import EventDropdown from 'src/components/events/EventDropdown';
import { useCommunityStore } from 'src/store/community.store';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileEventsPage } from 'src/mobile-pages';
import { useEvents } from 'src/hooks/useEvents';
import EventCardSkeleton from 'src/components/skeletons/EventCardSkeleton';

/**
 * Desktop Events Page Component
 * Displays events list with filtering tabs
 * Uses custom hooks for events management
 */
export default function EventsListComponent() {
  const { userCommunity } = useCommunityStore();
  const isMobile = useIsMobile();

  // Use custom hook for events management
  const { events, loading, activeTab, setActiveTab, refetchEvents } =
    useEvents();

  /**
   * Handle tab change
   * @param {string} value - The new tab value
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'today' | 'completed' | 'cancelled');
  };

  if (isMobile) return <MobileEventsPage />;

  return (
    <Fragment>
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="mx-auto flex items-start sm:items-center justify-between pt-[30px] pb-[15px] gap-3">
            <h1 className="text-xl font-semibold text-[#000000]">My Events</h1>
            <div className="self-end">
              {userCommunity?.role === 'ADMIN' && (
                <EventDropdown onSuccess={refetchEvents} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="max-w-[975px] mx-auto">
          <Tabs
            defaultValue="all"
            className="w-full gap-8 "
            onValueChange={handleTabChange}
          >
            <TabsList className="bg-white rounded-[15px] border border-[#ECECEC] p-[10px] h-auto mt-[30px]">
              <div
                className="flex gap-2 overflow-x-auto sm:overflow-visible lg:flex-nowrap sm:flex-wrap -mx-2 px-2"
                style={{ flexWrap: 'wrap' }}
              >
                <TabsTrigger
                  value="all"
                  className="px-4 py-1 rounded-lg text-[#787878] data-[state=active]:bg-[#E6EFF8] data-[state=active]:text-[#0A5DBC] font-semibold text-base"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="today"
                  className="px-4 py-1 rounded-lg text-[#787878] data-[state=active]:bg-[#E6EFF8] data-[state=active]:text-[#0A5DBC] font-semibold text-base"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-4 py-1 rounded-lg text-[#787878] data-[state=active]:bg-[#E6EFF8] data-[state=active]:text-[#0A5DBC] font-semibold text-base"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="px-4 py-1 rounded-lg text-[#787878] data-[state=active]:bg-[#E6EFF8] data-[state=active]:text-[#0A5DBC] font-semibold text-base"
                >
                  Cancelled
                </TabsTrigger>
              </div>
            </TabsList>

            {/* All Tab */}
            <TabsContent value="all">
              <div className="flex flex-col gap-6 mt-6">
                {loading ? (
                  <EventCardSkeleton count={4} />
                ) : events.length > 0 ? (
                  events.map((ev) => (
                    <EventCard key={ev.id} ev={ev} onSuccess={refetchEvents} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Today Tab */}
            <TabsContent value="today">
              <div className="flex flex-col gap-6 mt-6">
                {loading ? (
                  <EventCardSkeleton count={4} />
                ) : events.length > 0 ? (
                  events.map((ev) => (
                    <EventCard key={ev.id} ev={ev} onSuccess={refetchEvents} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Completed Tab */}
            <TabsContent value="completed">
              <div className="flex flex-col gap-6 mt-6">
                {loading ? (
                  <EventCardSkeleton count={4} />
                ) : events.length > 0 ? (
                  events.map((ev) => (
                    <EventCard key={ev.id} ev={ev} onSuccess={refetchEvents} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Cancelled Tab */}
            <TabsContent value="cancelled">
              <div className="flex flex-col gap-6 mt-6">
                {loading ? (
                  <EventCardSkeleton count={4} />
                ) : events.length > 0 ? (
                  events.map((ev) => (
                    <EventCard key={ev.id} ev={ev} onSuccess={refetchEvents} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Fragment>
  );
}
