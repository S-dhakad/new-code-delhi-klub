import React, { useEffect, useRef, useState } from 'react';
import Button from '../common/ui/Button';
import CancelEvent from '../modals/CancelEvent';
import EditEventForm from './EditEventForm';
import ManageParticipants from './ManageParticipants';
import Image from 'next/image';
import { Event, EventStatus } from 'src/types/events.types';
import { useEventActions } from 'src/hooks/useEventActions';
import { useCommunityStore } from 'src/store/community.store';

type EventCardProps = {
  event: Event;
  onSuccess?: () => void;
};

// Helper function to format date for display
const formatEventDate = (date?: string) => {
  if (!date) return 'Date TBD';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Date TBD';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return dateObj.toLocaleDateString('en-US', options);
  } catch {
    return 'Date TBD';
  }
};

// Helper function to format time range
const formatTimeRange = (date?: string, duration?: string) => {
  if (!date) return 'Time TBD';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Time TBD';

    const startTime = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return startTime;
  } catch {
    return 'Time TBD';
  }
};

// Helper function to parse duration in minutes
const parseDuration = (duration?: string): number => {
  if (!duration) return 0;

  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Mobile Event Card Component
 * Displays event details in mobile view with actions
 * Uses custom hooks for event operations
 */
const EventCard: React.FC<EventCardProps> = ({ event, onSuccess }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const { userCommunity } = useCommunityStore();
  const { joinEvent } = useEventActions(onSuccess);

  // Format event data for display
  const dateLabel = formatEventDate(event.date);
  const timeRange = formatTimeRange(event.date, event.duration);
  const durationMins = parseDuration(event.duration);
  const isRecurring = event.recurring;
  const title = event.name || 'Untitled Event';
  const description = event.description || 'No description available';
  const attendeesCount = event.UserEvents?.length || 0;
  const isUpcoming = event.status === EventStatus.UPCOMING;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  type MenuItem =
    | {
        key: string;
        label: string;
        destructive?: false;
        icon: React.ReactNode;
        dividerBelow?: boolean;
        onClick?: () => void;
      }
    | {
        key: string;
        label: string;
        destructive: true;
        icon: React.ReactNode;
        onClick?: () => void;
      };

  const menuItems: MenuItem[] = [
    {
      key: 'basic',
      label: 'Basic info',
      icon: (
        <Image src="/calendar.svg" alt="calendar icon" width={16} height={16} />
      ),
      dividerBelow: false,
      onClick: () => {
        setMenuOpen(false);
        setEditOpen(true);
      },
    },
    {
      key: 'participants',
      label: 'Participants',
      icon: (
        <Image
          src="/profile-2user.svg"
          alt="participants icon"
          width={16}
          height={16}
        />
      ),
      dividerBelow: true,
      onClick: () => {
        setMenuOpen(false);
        setParticipantsOpen(true);
      },
    },
    {
      key: 'cancel',
      label: 'Cancel event',
      destructive: true,
      icon: (
        <Image
          src="/close-square.svg"
          alt="cancel icon"
          width={16}
          height={16}
        />
      ),
      onClick: () => {
        setMenuOpen(false);
        setCancelOpen(true);
      },
    },
  ];

  return (
    <>
      <div className="rounded-[20px] bg-white shadow-sm px-4 py-5">
        {/* Date */}
        <div className="text-xl font-bold text-primary">{dateLabel}</div>

        {/* Title + Recurring pill */}
        <div className="mt-4 flex items-center gap-3">
          <h3 className="text-base font-medium">{title}</h3>
          {isRecurring && (
            <span className="inline-flex items-center rounded-[10px] bg-[#FEFFBD] text-sm font-medium px-3 py-1.5">
              Recurring
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-[10px] text-sm font-medium text-text-secondary">
          {description}
        </p>

        {/* Meta row */}
        <div className="mt-[10px] flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary w-4 h-4">
              <Image src="/clock.svg" alt="clock icon" width={16} height={16} />
            </span>
            <span>{timeRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary w-4 h-4">
              <Image src="/timer.svg" alt="clock icon" width={16} height={16} />
            </span>
            <span>{durationMins} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary w-4 h-4">
              <Image
                src="/profile-2user-1.svg"
                alt="attendees icon"
                width={16}
                height={16}
              />
            </span>
            <span>{attendeesCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-2 relative">
          {userCommunity?.role === 'ADMIN' && (
            <div className="relative" ref={menuRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                Edit
              </Button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 bottom-full flex flex-col gap-4 mb-2 w-[160px] rounded-2xl bg-white shadow-lg border border-[#ECECEC] p-5"
                >
                  {menuItems.map((item, idx) => (
                    <React.Fragment key={item.key}>
                      <button
                        role="menuitem"
                        className={
                          'w-full flex items-center gap-1.5 text-sm font-medium ' +
                          (item.destructive ? 'text-[#DE0000]' : 'text-black')
                        }
                        onClick={item.onClick}
                      >
                        <span className="w-4 h-4">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                      {'dividerBelow' in item && item.dividerBelow ? (
                        <div className="h-px bg-[#ECECEC]" />
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          {isUpcoming && (
            <Button
              variant="primary"
              size="sm"
              className="w-[82px]"
              onClick={() => joinEvent(event)}
              disabled={!event.meetLink}
            >
              Join
            </Button>
          )}
        </div>
      </div>
      {/* Edit Event Form */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <EditEventForm
            event={event}
            onClose={() => setEditOpen(false)}
            onSuccess={onSuccess}
          />
        </div>
      )}

      {/* Manage Participants */}
      {participantsOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <ManageParticipants
            event={event}
            onClose={() => setParticipantsOpen(false)}
            onSuccess={onSuccess}
          />
        </div>
      )}

      {/* Cancel Event */}
      {cancelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setCancelOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CancelEvent
              event={event}
              onClose={() => setCancelOpen(false)}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
