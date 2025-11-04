import { useEffect, useState } from 'react';
import { communityService } from 'src/axios/community/communityApi';
import { featuredPostService } from 'src/axios/profile/profileApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useCommunityStore } from 'src/store/community.store';
import { useProfileStore } from 'src/store/profile.store';
import { useToastStore } from 'src/store/toast.store';
import { Community } from 'src/types/community.types';
import { Post } from 'src/types/post.types';

export function useOwnProfile() {
  const { profile } = useProfileStore();
  const { community } = useCommunityStore();
  const showToast = useToastStore((s) => s.showToast);

  const [ownedCommunities, setOwnedCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<Community[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Load owned communities and memberships
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await communityService.getCommunitiesMe();
        const respOwned = result?.data?.ownedCommunities ?? [];
        const respMemberships = result?.data?.memberShips ?? [];
        setOwnedCommunities(respOwned);
        setMemberships(respMemberships);
      } catch (err) {
        const message = getErrorMessage(err);
        showToast({
          type: 'default-error',
          title: 'Failed loading communities',
          message,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showToast]);

  // Load featured posts when community changes
  useEffect(() => {
    const load = async () => {
      if (!community) return;
      try {
        setLoading(true);
        const response = await featuredPostService.getFeaturedPost(
          community.id,
        );
        setFeaturedPost(response.data ?? []);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error in fetching featured post',
          message,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [community, showToast]);

  return {
    profile,
    ownedCommunities,
    memberships,
    featuredPost,
    loading,
    isOwner: true,
  };
}
