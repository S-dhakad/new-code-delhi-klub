import { useProfileStore } from 'src/store/profile.store';
import axiosInstance from '../axios';

export const profileService = {
  async loadProfile() {
    const response = await axiosInstance.private.get('/auth/me');
    return response.data;
  },

  async loadProfilePublic(username: string) {
    const res = await axiosInstance.public.get(`/auth/${username}`);
    const profile = res.data.data;
    return profile;
  },

  clearProfile() {
    useProfileStore.getState().clearProfile();
  },
};

export const featuredPostService = {
  async getFeaturedPost(communityId: string | null) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/featured-posts`,
    );
    return response.data;
  },
};
