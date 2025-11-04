import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Event, EventStatus } from 'src/types/events.types';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { EditEventModal } from './EditEventModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EditParticipantModal } from './EditParticipantModal';
import { CancelModal } from '../modals/CancelModal';
import { useCommunityStore } from 'src/store/community.store';
import { useEventActions } from 'src/hooks/useEventActions';

// Helper function to format date
const formatDate = (date?: string) => {
  if (!date) return { month: 'N/A', day: 'N/A', weekday: 'N/A' };

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { month: 'N/A', day: 'N/A', weekday: 'N/A' };
    }

    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const day = dateObj.getDate().toString();
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return { month, day, weekday };
  } catch (error) {
    return { month: 'N/A', day: 'N/A', weekday: 'N/A' };
  }
};

// Helper function to get status string for styling
const getStatusString = (status?: EventStatus) => {
  switch (status) {
    case EventStatus.CANCELLED:
      return 'cancelled';
    case EventStatus.PAST:
      return 'completed';
    case EventStatus.UPCOMING:
    default:
      return 'upcoming';
  }
};

/**
 * Desktop Event Card Component
 * Displays individual event details with action buttons
 * @param {Event} ev - Event data to display
 * @param {Function} onSuccess - Callback after successful action
 */
export default function EventCard({
  ev,
  onSuccess,
}: {
  ev: Event;
  onSuccess?: () => void;
}) {
  // Get event status and formatting helpers
  const { month, day, weekday } = formatDate(ev.date);
  const statusString = getStatusString(ev.status);

  // Local state for modal visibility
  const [editEventopen, setEditEventOpen] = useState(false);
  const [editParticipantopen, setEditParticipantOpen] = useState(false);
  const [canceEventOpen, setCanceEventOpen] = useState(false);

  const { userCommunity } = useCommunityStore();

  // Use custom hook for event actions
  const { joinEvent } = useEventActions(onSuccess);
  return (
    <Fragment>
      <Card className="w-full rounded-[20px] border border-[#ECECEC] py-6 px-[30px]">
        <CardContent className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center px-0">
          <div className="flex w-full sm:w-auto items-start sm:items-center gap-4">
            {/* Date column */}
            <div className="flex flex-col text-center justify-between min-w-[64px]">
              <div
                className={`text-sm sm:text-base font-medium ${
                  statusString === 'cancelled'
                    ? 'text-red-500'
                    : statusString === 'completed'
                      ? 'text-black'
                      : 'text-slate-500'
                }`}
              >
                {month}
              </div>

              <div
                className={`font-semibold leading-none text-[32px] sm:text-[40px] ${
                  statusString === 'cancelled'
                    ? 'text-red-500'
                    : statusString === 'completed'
                      ? 'text-black'
                      : 'text-slate-500'
                }`}
              >
                {day}
              </div>

              <div
                className={`text-sm sm:text-base font-medium ${
                  statusString === 'cancelled'
                    ? 'text-red-500'
                    : statusString === 'completed'
                      ? 'text-black'
                      : 'text-slate-500'
                }`}
              >
                {weekday}
              </div>
            </div>

            {/* vertical divider hidden on small screens */}
            <div className="hidden sm:block bg-[#ECECEC] mx-[20px] w-[1px] h-16" />

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold truncate text-[#000000]">
                      {ev.name || 'Untitled Event'}
                    </h3>
                    {ev.recurring && (
                      <Badge className="ml-2 bg-[#FEFFBD] text-[#000000] text-sm font-medium">
                        Recurring
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400  font-medium">
                    {ev.community?.name && `Community: ${ev.community.name}`}
                    {ev.eventAdmin?.firstName &&
                      ev.eventAdmin?.lastName &&
                      ` • Host: ${ev.eventAdmin.firstName} ${ev.eventAdmin.lastName}`}
                  </p>
                  <p className="mt-[10px] text-sm text-[#787878] font-medium">
                    {ev.description || 'No description available'}
                  </p>

                  <div className="mt-[10px] flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/clock.svg"
                        alt="Time"
                        width={18}
                        height={18}
                      />
                      <span className="text-base font-medium text-[#000000]">
                        {ev.date
                          ? (() => {
                              try {
                                return new Date(ev.date).toLocaleTimeString(
                                  'en-US',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  },
                                );
                              } catch {
                                return 'TBD';
                              }
                            })()
                          : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/timer.svg"
                        alt="Duration"
                        width={18}
                        height={18}
                      />
                      <span className="text-base font-medium text-[#000000]">
                        {ev.duration || 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/profile-2user-1.svg"
                        alt="Location"
                        width={18}
                        height={18}
                      />
                      <span className="text-base font-medium text-[#000000]">
                        {ev.location || 'Online'}
                      </span>
                    </div>
                    {userCommunity?.role === 'ADMIN' && (
                      <div>
                        <p className="py-1 px-3 rounded-xl bg-[#FFE8E8] font-medium text-base text-[#DE0000]">
                          3 new members
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons: inline on sm+, stacked on mobile */}
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
            {userCommunity?.role === 'ADMIN' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="h-10 w-full sm:w-[52px] rounded-[10px] border border-[#ECECEC] text-sm font-medium text-[#000000] bg-[#F6F6F6]">
                  Edit
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3 rounded-2xl">
                  <DropdownMenuItem
                    className="p-2 font-medium text-sm text-black"
                    onClick={() => setEditEventOpen(true)}
                  >
                    <Image
                      src="/calendar.svg"
                      alt="calendar icon"
                      width={16}
                      height={16}
                    />
                    <span>Basic info</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="p-2 font-medium text-sm text-black"
                    onClick={() => setEditParticipantOpen(true)}
                  >
                    <Image
                      src="/profile-2user.svg"
                      alt="user icon"
                      width={16}
                      height={16}
                    />
                    <span>Participants</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="p-2 font-medium text-sm text-red-500 focus:text-red-500"
                    onClick={() => setCanceEventOpen(true)}
                  >
                    <Image
                      src="/close-square.svg"
                      alt="close icon"
                      width={16}
                      height={16}
                    />
                    <span>Cancel event</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {statusString === 'upcoming' && (
              <Button
                size="sm"
                className="h-10 w-full sm:w-[82px] rounded-[10px] text-white text-sm font-medium transition-colors duration-300 hover:bg-[#053875]"
                onClick={() => joinEvent(ev)}
                disabled={!ev.meetLink}
              >
                Join
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <EditEventModal
        open={editEventopen}
        setOpen={setEditEventOpen}
        onOpenChange={setEditEventOpen}
        event={ev}
        onSuccess={onSuccess}
      />
      <EditParticipantModal
        open={editParticipantopen}
        setOpen={setEditParticipantOpen}
        onOpenChange={setEditParticipantOpen}
        event={ev}
        onSuccess={onSuccess}
      />
      <CancelModal
        open={canceEventOpen}
        setOpen={setCanceEventOpen}
        onOpenChange={setCanceEventOpen}
        event={ev}
        onSuccess={onSuccess}
      />
    </Fragment>
  );
}
