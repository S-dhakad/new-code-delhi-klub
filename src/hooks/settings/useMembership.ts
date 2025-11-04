'use client';

import { useState, useEffect } from 'react';
import { communityService } from 'src/axios/community/communityApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Community } from 'src/types/community.types';

export const DISCOVER_KLUB = {
  id: 'discover',
  title: 'Discover new Klubs',
  subtitle: "Let's find you a Klub",
  avatar: '/discoverFull.svg',
  action: 'discover' as const,
};

export const useMembership = () => {
  const [open, setOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSettingMembership, setShowSettingMembership] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const fetchCommunities = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await communityService.getCommunitiesMe({
        limit: 10,
        page: pageNum,
      });
      const data = response.data;
      if (pageNum === 1) {
        setCommunities([...data.ownedCommunities, ...data.memberShips]);
      } else {
        setCommunities((prev) => [
          ...prev,
          ...data.ownedCommunities,
          ...data.memberShips,
        ]);
      }

      setHasMore(response.length === 10);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error fetching communities',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCommunities(1);
    }
  }, [open]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchCommunities(page + 1);
    }
  };

  return {
    open,
    setOpen,
    communities,
    loading,
    hasMore,
    handleScroll,
    showSettingMembership,
    setShowSettingMembership,
  };
};
