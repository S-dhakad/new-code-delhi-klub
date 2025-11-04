'use client';

import { useState, useEffect } from 'react';
import { useProfileStore } from 'src/store/profile.store';
import { useCommunityStore } from 'src/store/community.store';
import { authService } from 'src/axios/auth/authApi';
import { communityService } from 'src/axios/community/communityApi';
import {
  SocialMediaPlatform,
  SocialMediaLink,
  ProfileUpdateRequest,
} from 'src/types/login.types';
import { useAuthStore } from 'src/store/auth.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export const useSocialLinks = (
  context: 'profile' | 'community' = 'profile',
) => {
  const { profile } = useProfileStore();
  const { community, setCommunity } = useCommunityStore();
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  // Load social media data into form when profile/community changes
  useEffect(() => {
    if (context === 'profile' && profile) {
      const existingLinks = profile.userSocialMedia || [];

      // Initialize all platforms with empty values or existing data
      const initialLinks: SocialMediaLink[] = Object.values(
        SocialMediaPlatform,
      ).map((platform) => {
        const existing = existingLinks.find(
          (link) => link.platform === platform,
        );
        return {
          platform,
          url: existing?.url || '',
          label:
            existing?.label ||
            (platform === SocialMediaPlatform.CUSTOM_URL1 ||
            platform === SocialMediaPlatform.CUSTOM_URL2
              ? ''
              : undefined),
        };
      });

      setSocialLinks(initialLinks);
    } else if (context === 'community' && community) {
      // Initialize community social links from the community data
      const initialLinks: SocialMediaLink[] = Object.values(
        SocialMediaPlatform,
      ).map((platform) => {
        let url = '';
        switch (platform) {
          case SocialMediaPlatform.WEBSITE:
            url = community.website || '';
            break;
          case SocialMediaPlatform.YOUTUBE:
            url = community.youtube || '';
            break;
          case SocialMediaPlatform.INSTAGRAM:
            url = community.instagram || '';
            break;
          case SocialMediaPlatform.LINKEDIN:
            url = community.linkedin || '';
            break;
          case SocialMediaPlatform.FACEBOOK:
            url = community.facebook || '';
            break;
          default:
            url = '';
        }

        return {
          platform,
          url,
          label:
            platform === SocialMediaPlatform.CUSTOM_URL1 ||
            platform === SocialMediaPlatform.CUSTOM_URL2
              ? ''
              : undefined,
        };
      });

      setSocialLinks(initialLinks);
    }
  }, [profile, community, context]);

  const handleInputChange = (
    platform: SocialMediaPlatform,
    field: 'url' | 'label',
    value: string,
  ) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platform ? { ...link, [field]: value } : link,
      ),
    );
  };

  const handleSave = async () => {
    if (!accessToken) return;
    const allEmpty = socialLinks.every((link) => link.url.trim() === '');
    if (allEmpty) {
      showToast({
        type: 'default-error',
        title: 'Please provide at least one link',
      });
      return;
    }
    try {
      setLoading(true);
      if (context === 'profile' && profile) {
        // Filter out empty social links
        const validSocialLinks = socialLinks.filter(
          (link) => link.url.trim() !== '',
        );

        const updateData: ProfileUpdateRequest = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          bio: profile.bio,
          profilePictureUrl: undefined,
          dateOfBirth: profile.dateOfBirth,
          socialMediaLinks: validSocialLinks,
        };

        await authService.updateProfile(updateData);

        // Update the profile in the store after successful update
        const updatedProfile = { ...profile, ...updateData };
        useProfileStore.getState().setProfile(updatedProfile);
        showToast({
          type: 'default-success',
          title: 'Changes Saved',
        });
      } else if (context === 'community' && community) {
        // Prepare community update data with social links
        const websiteLink =
          socialLinks.find(
            (link) => link.platform === SocialMediaPlatform.WEBSITE,
          )?.url || '';
        const youtubeLink =
          socialLinks.find(
            (link) => link.platform === SocialMediaPlatform.YOUTUBE,
          )?.url || '';
        const instagramLink =
          socialLinks.find(
            (link) => link.platform === SocialMediaPlatform.INSTAGRAM,
          )?.url || '';
        const linkedinLink =
          socialLinks.find(
            (link) => link.platform === SocialMediaPlatform.LINKEDIN,
          )?.url || '';
        const facebookLink =
          socialLinks.find(
            (link) => link.platform === SocialMediaPlatform.FACEBOOK,
          )?.url || '';

        const updateData = {
          website: websiteLink || undefined,
          youtube: youtubeLink || undefined,
          instagram: instagramLink || undefined,
          linkedin: linkedinLink || undefined,
          facebook: facebookLink || undefined,
        };

        await communityService.updateCommunity(community.id, updateData);

        // Update the community in the store after successful update
        const updatedCommunity = { ...community, ...updateData };
        setCommunity(updatedCommunity);
        showToast({
          type: 'default-success',
          title: 'Changes Saved',
        });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update social links:',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSocialLink = (platform: SocialMediaPlatform) => {
    return (
      socialLinks.find((link) => link.platform === platform) || {
        platform,
        url: '',
        label: '',
      }
    );
  };

  const getPlatformLabel = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case SocialMediaPlatform.WEBSITE:
        return context === 'community' ? 'Community Website' : 'My Website';
      case SocialMediaPlatform.YOUTUBE:
        return 'YouTube';
      case SocialMediaPlatform.INSTAGRAM:
        return 'Instagram';
      case SocialMediaPlatform.LINKEDIN:
        return 'LinkedIn';
      case SocialMediaPlatform.FACEBOOK:
        return 'Facebook';
      case SocialMediaPlatform.CUSTOM_URL1:
        return 'Custom URL 1';
      case SocialMediaPlatform.CUSTOM_URL2:
        return 'Custom URL 2';
      default:
        return platform;
    }
  };

  return {
    socialLinks,
    loading,
    isProfile: context === 'profile',
    handleInputChange,
    handleSave,
    getSocialLink,
    getPlatformLabel,
  };
};
