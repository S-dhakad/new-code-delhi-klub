import axiosInstance from '../axios';
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  AddEventMemberDto,
  RemoveEventMemberDto,
  EventStatus,
} from '../../types/events.types';

export const eventsService = {
  // Create a new event
  async createEvent(communityId: string, data: CreateEventDto) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/events`,
      data,
    );
    return response.data;
  },

  // Get all events for a community with pagination
  async getEvents(
    communityId: string,
    query?: {
      search?: string;
      sort?: 'latest' | 'oldest';
      limit?: number;
      page?: number;
    },
  ) {
    const params = new URLSearchParams();

    if (query?.search) params.append('search', query.search);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/events?${params.toString()}`,
    );
    return response.data;
  },

  // Get events by status with pagination
  async getEventsByStatus(
    communityId: string,
    status: EventStatus,
    query?: {
      search?: string;
      sort?: 'latest' | 'oldest';
      limit?: number;
      page?: number;
    },
  ) {
    const params = new URLSearchParams();

    params.append('status', status);
    if (query?.search) params.append('search', query.search);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/events-by-status?${params.toString()}`,
    );
    return response.data;
  },

  // Get all events across all communities (for "today" tab)
  async getAllEventsToday(
    communityId: string,
    query?: {
      search?: string;
      sort?: 'latest' | 'oldest';
      limit?: number;
      page?: number;
    },
  ) {
    const params = new URLSearchParams();

    if (query?.search) params.append('search', query.search);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/events-today?${params.toString()}`,
    );
    return response.data;
  },

  // Get event by ID
  async getEventById(communityId: string, eventId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/events/${eventId}`,
    );
    return response.data;
  },

  // Update event
  async updateEvent(
    communityId: string,
    eventId: string,
    data: UpdateEventDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/events/${eventId}`,
      data,
    );
    return response.data;
  },

  // Delete event
  async deleteEvent(communityId: string, eventId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/events/${eventId}`,
    );
    return response.data;
  },

  // Add members to event
  async addEventMembers(
    communityId: string,
    eventId: string,
    data: AddEventMemberDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/events/${eventId}/add-members`,
      data,
    );
    return response.data;
  },

  // Remove members from event
  async removeEventMembers(
    communityId: string,
    eventId: string,
    data: RemoveEventMemberDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/events/${eventId}/remove-members`,
      data,
    );
    return response.data;
  },
};
