import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCreatorRazorpayStore,
  useSubscriberRazorpayStore,
} from 'src/store/creator-subscriber-razorpay.store';
import { authService } from 'src/axios/auth/authApi';
import { profileService } from 'src/axios/profile/profileApi';
import { useProfileStore } from 'src/store/profile.store';
import { useToastStore } from 'src/store/toast.store';
import { ProfileUpdateRequest } from 'src/types/login.types';
import { FileUploadPayload } from 'src/types/uploads.types';
import { MediaItem } from 'src/components/FileUploader';
import { useAuthStore } from 'src/store/auth.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export function useProfileForm() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { showToast } = useToastStore();
  const { accessToken } = useAuthStore();
  const { initalizeRazorpay: initalizeRazorpayCreator } =
    useCreatorRazorpayStore();
  const {
    initalizeRazorpay: initalizeRazorpaySubscriber,
    communityId: communityIdFromSubscriberStore,
  } = useSubscriberRazorpayStore();

  // Form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [avatar, setAvatar] = useState('/dummyProfile.png');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Username availability checking
  const usernameRequestSeqRef = useRef(0);

  // Profile picture upload
  const [profilePictureData, setProfilePictureData] =
    useState<FileUploadPayload | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Initialize form data from profile store only once
  useEffect(() => {
    if (profile && !isInitialized) {
      setFullName(
        `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      );
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setWhatsapp(profile.phoneNumber || '');

      // Convert dateOfBirth from ISO string to YYYY-MM-DD format for date input
      if (profile.dateOfBirth) {
        const date = new Date(profile.dateOfBirth);
        const formattedDate = date.toISOString().split('T')[0];
        setDob(formattedDate);
      } else {
        setDob('');
      }

      setAvatar(profile.profilePicture || '/dummyProfile.png');
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  // File picker handler
  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  // Username availability checking function
  const checkUsernameImmediate = async (rawUsername: string) => {
    const usernameValue = rawUsername.trim();

    // Show cross icon for usernames less than 3 characters
    if (!usernameValue) {
      setIsUsernameAvailable(null);
      return;
    }

    if (usernameValue.length < 3) {
      setIsUsernameAvailable(false);
      return;
    }

    // Show cross icon for usernames with spaces
    if (usernameValue.includes(' ')) {
      setIsUsernameAvailable(false);
      return;
    }

    const requestId = ++usernameRequestSeqRef.current;
    try {
      const res = await authService.checkUsername(usernameValue);
      type UsernameApiResponse = {
        data?: {
          isAvailable?: boolean;
        };
      };
      const safe = res as unknown as UsernameApiResponse;
      const available =
        typeof safe.data?.isAvailable === 'boolean'
          ? safe.data?.isAvailable
          : null;

      if (requestId !== usernameRequestSeqRef.current) return;
      if (available === true) {
        setIsUsernameAvailable(true);
        // Make API call to update username when it's available
        await updateUsernameOnly(usernameValue);
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

  const updateUsernameOnly = async (usernameValue: string) => {
    if (!profile) return;
    if (!accessToken) return;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!token) return;

    try {
      const updateData: ProfileUpdateRequest = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: usernameValue,
        phoneNumber: whatsapp || undefined,
      };

      await authService.updateProfile(updateData);
      // Update only the username and phone number in the profile store without refetching all data
      // This prevents other form fields from being reset
      const currentProfile = useProfileStore.getState().profile;
      if (currentProfile) {
        useProfileStore.getState().setProfile({
          ...currentProfile,
          username: usernameValue,
          phoneNumber: whatsapp || undefined,
        });
      }
      showToast({
        title: 'Username update successfully',
        type: 'default-success',
      });
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update username',
        message,
      });
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
    if (first.file) {
      const mockEvent = {
        target: { files: [first.file] },
      } as unknown as ChangeEvent<HTMLInputElement>;
      onPickFile(mockEvent);
    }

    // Store S3 upload data
    if (first.s3Data) {
      setProfilePictureData({
        key: first.s3Data.fileKey,
        mimetype: first.s3Data.mimetype,
        size: first.s3Data.size,
      });
    }
  };

  const handleUsernameChange = (inputValue: string) => {
    // Check if input contains spaces
    if (inputValue.includes(' ')) {
      showToast({
        title: 'Invalid Username',
        message: 'Username cannot contain spaces',
        type: 'error',
      });
      return; // Don't update the username state
    }

    // Ensure username is a string and update state
    const cleanUsername = String(inputValue);
    setUsername(cleanUsername);
    checkUsernameImmediate(cleanUsername);
  };

  const handleSubmit = async () => {
    if (!profile) return;
    if (!accessToken) return;

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      showToast({
        title: 'Invalid Full Name',
        message: 'Full name cannot be blank',
        type: 'default-error',
      });
      return;
    }

    // Validate username length and format
    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 3) {
      showToast({
        title: 'Invalid Username',
        message: 'Username should be at least 3 characters long',
        type: 'default-error',
      });
      return;
    }

    // Validate username doesn't contain spaces
    if (trimmedUsername.includes(' ')) {
      showToast({
        title: 'Invalid Username',
        message: 'Username cannot contain spaces',
        type: 'default-error',
      });
      return;
    }

    // Check if username is taken
    if (isUsernameAvailable === false) {
      showToast({
        title: 'Username Taken',
        message: 'Username already exists. Please choose a different one.',
        type: 'default-error',
      });
      return;
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!token) {
      return;
    }

    setLoading(true);

    try {
      // Parse fullName into firstName and lastName
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updateData: ProfileUpdateRequest = {
        firstName,
        lastName,
        username,
        bio,
        phoneNumber: whatsapp || undefined,
        dateOfBirth: dob ? new Date(dob).toISOString() : undefined,
        profilePictureUrl: profilePictureData || undefined,
      };

      await authService.updateProfile(updateData);
      const updatedProfile = await profileService.loadProfile();
      useProfileStore.getState().setProfile(updatedProfile.data);
      showToast({
        title: 'Profile updated successfully',
        type: 'default-success',
      });

      // Check initializeRazorpay flags and route accordingly
      if (initalizeRazorpayCreator) {
        console.log('initalizeRazorpay is true');
        router.push('/create-community');
      } else if (initalizeRazorpaySubscriber) {
        console.log('initalizeRazorpay is true');
        router.push(`/klub-profile/${communityIdFromSubscriberStore}`);
      } else {
        // Redirect to discovery (handles both mobile and desktop)
        router.push('/discovery');
      }
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

  return {
    // State
    fullName,
    setFullName,
    username,
    setUsername,
    bio,
    setBio,
    dob,
    setDob,
    whatsapp,
    setWhatsapp,
    avatar,
    setAvatar,
    isUsernameAvailable,
    setIsUsernameAvailable,
    loading,
    profile,

    // Handlers
    onPickFile,
    handleFilesAdded,
    handleUsernameChange,
    handleSubmit,
    checkUsernameImmediate,
  };
}
