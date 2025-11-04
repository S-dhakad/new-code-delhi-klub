import axiosInstance from '../axios';
import {
  Community,
  CreateCommunityDto,
  UpdateCommunityDto,
} from '../../types/community.types';

export const communityService = {
  // Create a new community
  async createCommunity(data: CreateCommunityDto) {
    const response = await axiosInstance.private.post('/community', data);
    return response.data;
  },

  // Get communities with filters (requires topics parameter)
  async getCommunities(query: {
    search?: string;
    topics?: string[];
    type?: 'both' | 'private-paid' | 'public-free';
    sort?: 'latest' | 'oldest';
    limit?: number;
    page?: number;
  }) {
    const params = new URLSearchParams();

    if (query.topics && query.topics.length > 0) {
      params.append('topics', query.topics.join(','));
    }
    if (query.search) params.append('search', query.search);
    if (query.type) params.append('type', query.type);
    if (query.sort) params.append('sort', query.sort);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/list?${params.toString()}`,
    );
    return response.data;
  },

  // Get all communities (no topics filter required)
  async getAllCommunities(query: {
    search?: string;
    type?: 'both' | 'private-paid' | 'public-free';
    sort?: 'latest' | 'oldest';
    limit?: number;
    page?: number;
  }) {
    const params = new URLSearchParams();

    if (query.search) params.append('search', query.search);
    if (query.type) params.append('type', query.type);
    if (query.sort) params.append('sort', query.sort);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/list/all?${params.toString()}`,
    );
    return response.data;
  },

  // Get user's own communities and memberships
  async getCommunitiesMe(query?: {
    sort?: 'latest' | 'oldest';
    limit?: number;
    page?: number;
  }) {
    const params = new URLSearchParams();

    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/list/me?${params.toString()}`,
    );
    return response.data;
  },

  // Get community by ID
  async getCommunityById(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}`,
    );
    return response.data;
  },
  // Get community by ID
  async getCommunityByIdPublic(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/public`,
    );
    return response.data;
  },

  async getCommunityDashboardReported(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/dashboard/subscriptions/report`,
    );
    return response.data;
  },

  async getUserCommunityListByUserName(username: string) {
    const res = await axiosInstance.public.get(
      `/community/list/me/public/${username}`,
    );
    const data = res.data.data;

    return data;
  },

  // Update community
  async updateCommunity(communityId: string, data: UpdateCommunityDto) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}`,
      data,
    );
    return response.data;
  },

  // Delete community
  async deleteCommunity(communityId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}`,
    );
    return response.data;
  },

  // Join community
  async joinCommunity(communityId: string) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/join`,
    );
    return response.data;
  },

  // Leave community
  async leaveCommunity(communityId: string) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/leave`,
    );
    return response.data;
  },

  // Kick out members (admin only)
  async kickOutMembers(communityId: string, memberIds: string[]) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/kick-out-members`,
      {
        memberIds,
      },
    );
    return response.data;
  },

  // Get community members
  async getCommunityMembers(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/members`,
    );
    return response.data;
  },

  async checkRezorPayemail(email: string) {
    const response = await axiosInstance.private.get(
      `/community/check-razorpay-email?email=${email}`,
    );
    return response.data;
  },

  async updateRezorPayemail(communityId: string, email: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/update-razorpay-email?email=${email}`,
    );
    return response.data;
  },
};
