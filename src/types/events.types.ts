import { Community } from './community.types';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
  CANCELLED = 'CANCELLED',
}

export interface EventAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface EventMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface UserEvent {
  id: string;
  userId: string;
  eventId: string;
  eventMemberId: string;
  eventSendAt: string;
  eventMember: EventMember;
}

export interface Event {
  id: string;
  name: string;
  url: string;
  description: string;
  duration: string;
  date: string;
  googleCalendarEventId: string;
  meetLink: string;
  recurring: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  eventAdminId: string;
  communityId: string;
  community: Community;
  eventAdmin: EventAdmin;
  UserEvents: UserEvent[];
  // Optional fields for backward compatibility
  location?: string;
  timeZone?: string;
}

export interface CreateEventDto {
  name?: string;
  description?: string;
  duration?: string;
  date?: Date;
  recurring?: boolean;
  location?: string;
  timeZone?: string;
  attendeeEmails?: string[];
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  duration?: string;
  date?: Date;
  recurring?: boolean;
  status?: EventStatus;
  location?: string;
  timeZone?: string;
}

export interface AddEventMemberDto {
  emails: string[];
}

export interface RemoveEventMemberDto {
  emails: string[];
}

export interface EventMemberResponse {
  email: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  result: unknown;
}

export interface RecurringEventOptions {
  isRecurring: boolean;
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  startTime?: string; // Time in HH:MM format
  endDate?: Date; // When to stop recurring
}
