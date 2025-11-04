import axiosInstance from '../axios';
import { ProfileUpdateRequest } from '../../types/login.types';

export const authService = {
  // Get Google OAuth URL
  async getAuthUrl() {
    const response = await axiosInstance.public.get('/auth');
    return response.data;
  },

  // Handle Google OAuth callback
  async googleOAuthCallback(data: { code: string }) {
    const response = await axiosInstance.public.post('/auth/callback', {
      code: data.code as string,
    });

    return response.data;
  },

  // Update user profile
  async updateProfile(data: ProfileUpdateRequest) {
    const response = await axiosInstance.private.put('/auth/profile', data);
    return response.data;
  },

  async checkUsername(username: string) {
    const response = await axiosInstance.private.get(
      `/auth/check-username?username=${username}`,
    );
    return response.data;
  },
};
