import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { communityService } from 'src/axios/community/communityApi';
import { profileService } from 'src/axios/profile/profileApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useProfileStore } from 'src/store/profile.store';
import { useToastStore } from 'src/store/toast.store';
import { Community } from 'src/types/community.types';
import { Profile } from 'src/types/profile.types';

export function usePublicProfile(userId: string) {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const { profile: currentUserProfile } = useProfileStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownedCommunities, setOwnedCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        // Load profile data
        const profileData = await profileService.loadProfilePublic(userId);
        setProfile(profileData);

        // Load communities
        const result =
          await communityService.getUserCommunityListByUserName(userId);
        if (result) {
          setOwnedCommunities(result.ownedCommunities || []);
          setMemberships(result.memberShips || []);
        }
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed loading profile data',
          message,
        });
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, router, showToast]);

  // Check if viewing own profile
  const isOwner =
    currentUserProfile &&
    profile &&
    (currentUserProfile.id === profile.id ||
      currentUserProfile.username === profile.username);

  return {
    profile,
    ownedCommunities,
    memberships,
    featuredPost: [], // Public profiles don't show featured posts
    loading,
    isOwner: !!isOwner,
  };
}
