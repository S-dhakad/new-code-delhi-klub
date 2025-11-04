import { useEffect, useRef, useState } from 'react';
import { ProfileUpdateRequest } from 'src/types/login.types';
import { useProfileStore } from 'src/store/profile.store';
import { useAuthStore } from 'src/store/auth.store';
import { useToastStore } from 'src/store/toast.store';
import { authService } from 'src/axios/auth/authApi';
import { profileService } from 'src/axios/profile/profileApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { FileUploadPayload } from 'src/types/uploads.types';
import { MediaItem } from 'src/components/FileUploader';

export interface GeneralInfoFormData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  profilePictureUrl: string;
}

export const useGeneralInfo = () => {
  const { profile } = useProfileStore();
  const showToast = useToastStore((s) => s.showToast);
  const { accessToken } = useAuthStore();
  const [formData, setFormData] = useState<GeneralInfoFormData>({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    profilePictureUrl: '',
  });

  const [profilePictureData, setProfilePictureData] =
    useState<FileUploadPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const usernameRequestSeqRef = useRef(0);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        profilePictureUrl: profile.profilePicture || '',
      });
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {}
        previewUrlRef.current = null;
      }
      setSelectedFile(null);
    }
  }, [profile]);

  const updateUsernameOnly = async (usernameValue: string) => {
    if (!profile) return;
    if (!accessToken) return;
    try {
      const updateData: ProfileUpdateRequest = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: usernameValue,
        phoneNumber: profile.phoneNumber || undefined,
      };
      await authService.updateProfile(updateData);
      const currentProfile = useProfileStore.getState().profile;
      if (currentProfile) {
        useProfileStore.getState().setProfile({
          ...currentProfile,
          username: usernameValue,
        });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update username',
        message,
      });
    }
  };

  const checkUsernameImmediate = async (rawUsername: string) => {
    const username = rawUsername.trim();
    if (!username) {
      setIsUsernameAvailable(null);
      return;
    }
    if (username.length < 3) {
      setIsUsernameAvailable(false);
      return;
    }
    if (username.includes(' ')) {
      setIsUsernameAvailable(false);
      return;
    }

    const requestId = ++usernameRequestSeqRef.current;
    try {
      const res = await authService.checkUsername(username);
      type UsernameApiResponse = { data?: { isAvailable?: boolean } };
      const safe = res as unknown as UsernameApiResponse;
      const available =
        typeof safe.data?.isAvailable === 'boolean'
          ? safe.data?.isAvailable
          : null;

      if (requestId !== usernameRequestSeqRef.current) return;
      if (available === true) {
        setIsUsernameAvailable(true);
        await updateUsernameOnly(username);
      } else if (available === false) {
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(null);
      }
    } catch {
      if (requestId === usernameRequestSeqRef.current) {
        setIsUsernameAvailable(null);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'username' && value.includes(' ')) {
      showToast({
        type: 'default-error',
        title: 'Invalid Username',
        message: 'Username cannot contain spaces',
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'username') {
      checkUsernameImmediate(value);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!accessToken) return;

    if (!formData.firstName.trim()) {
      showToast({
        type: 'default-error',
        title: 'First name required',
        message: 'Please enter your first name.',
      });
      return;
    }

    if (!formData.lastName.trim()) {
      showToast({
        type: 'default-error',
        title: 'Last name required',
        message: 'Please enter your last name.',
      });
      return;
    }

    if (!formData.username.trim() || formData.username.length < 3) {
      showToast({
        type: 'default-error',
        title: 'Invalid Username',
        message: 'Username must be at least 3 characters long.',
      });
      return;
    }

    if (formData.username.includes(' ')) {
      showToast({
        type: 'default-error',
        title: 'Invalid Username',
        message: 'Username cannot contain spaces.',
      });
      return;
    }

    if (isUsernameAvailable === false) {
      showToast({
        type: 'default-error',
        title: 'Username Taken',
        message: 'Please choose a different username.',
      });
      return;
    }

    setLoading(true);
    try {
      const updateData: ProfileUpdateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        bio: formData.bio,
        profilePictureUrl: profilePictureData || undefined,
      };

      await authService.updateProfile(updateData);
      const updatedProfile = await profileService.loadProfile();
      useProfileStore.getState().setProfile(updatedProfile.data);
      setSelectedFile(null);
      setProfilePictureData(null);
      showToast({
        type: 'default-success',
        title: 'Changes Saved',
      });
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update profile',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilesAdded = (files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;
    const first = items[0];
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {}
      previewUrlRef.current = null;
    }

    previewUrlRef.current = first.url;
    setSelectedFile(first.file ?? null);
    setFormData((prev) => ({
      ...prev,
      profilePictureUrl: first.url,
    }));

    // Store S3 upload data
    if (first.s3Data) {
      setProfilePictureData({
        key: first.s3Data.fileKey,
        mimetype: first.s3Data.mimetype,
        size: first.s3Data.size,
      });
    }
  };

  const handleRemoveProfilePicture = () => {
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {}
      previewUrlRef.current = null;
    }
    setSelectedFile(null);
    setProfilePictureData(null);
    setFormData((prev) => ({ ...prev, profilePictureUrl: '' }));
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {}
        previewUrlRef.current = null;
      }
    };
  }, []);

  return {
    formData,
    loading,
    isUsernameAvailable,
    handleInputChange,
    handleSave,
    handleFilesAdded,
    handleRemoveProfilePicture,
  };
};
