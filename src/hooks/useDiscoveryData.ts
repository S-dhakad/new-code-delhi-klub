import { useState, useEffect, useCallback } from 'react';
import { communityService } from 'src/axios/community/communityApi';
import { Community } from 'src/types/community.types';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

// Mapping for type filters to API values
const typeFilterMapping: Record<
  string,
  'both' | 'private-paid' | 'public-free'
> = {
  Both: 'both',
  'Private - Paid': 'private-paid',
  'Public - Free': 'public-free',
};

export function useDiscoveryData() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['All']);
  const [selectedType, setSelectedType] = useState<string>('Both');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const showToast = useToastStore((s) => s.showToast);

  // Function to fetch communities based on filters
  const fetchCommunities = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        let response;

        // If "All" is selected or no specific topics are selected, use getAllCommunities
        if (selectedTopics.includes('All') || selectedTopics.length === 0) {
          response = await communityService.getAllCommunities({
            search: searchQuery,
            type: typeFilterMapping[selectedType],
            sort: 'latest',
            limit: 9,
            page: page,
          });
        } else {
          // Use getCommunities with specific topics
          response = await communityService.getCommunities({
            search: searchQuery || undefined,
            topics: selectedTopics,
            type: typeFilterMapping[selectedType],
            sort: 'latest',
            limit: 9,
            page: page,
          });
        }

        // Extract communities from the nested response structure
        const allCommunities = response.data?.communities || [];

        // Update pagination info
        const options = response.data?.options;
        setHasNextPage(options?.hasNextPage || false);
        setCurrentPage(page);

        if (append) {
          // Append new communities to existing ones with deduplication
          setCommunities((prev) => {
            const existingIds = new Set(prev.map((c: Community) => c.id));
            const newCommunities = allCommunities.filter(
              (c: Community) => !existingIds.has(c.id),
            );
            return [...prev, ...newCommunities];
          });
        } else {
          // Replace communities (for new search/filter)
          setCommunities(allCommunities);
        }
      } catch (err) {
        setError('Failed to fetch communities. Please try again.');
        const message = getErrorMessage(err);
        showToast({
          type: 'default-error',
          title: 'Failed to fetch communities',
          message,
        });
        if (!append) {
          setCommunities([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedTopics, selectedType, searchQuery, showToast],
  );

  // Function to load more communities
  const loadMoreCommunities = useCallback(async () => {
    if (hasNextPage && !loadingMore && !loading) {
      await fetchCommunities(currentPage + 1, true);
    }
  }, [hasNextPage, loadingMore, loading, currentPage, fetchCommunities]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      loadMoreCommunities();
    }
  }, [loadMoreCommunities]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Fetch communities when filters change (reset to page 1)
  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchCommunities(1, false);
    }, 300);
    return () => clearTimeout(delay);
  }, [selectedTopics, selectedType, searchQuery, fetchCommunities]);

  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    if (topic === 'All') {
      setSelectedTopics(['All']);
    } else {
      setSelectedTopics((prev) => {
        const filtered = prev.filter((t) => t !== 'All');
        if (filtered.includes(topic)) {
          const newTopics = filtered.filter((t) => t !== topic);
          return newTopics.length === 0 ? ['All'] : newTopics;
        } else {
          return [...filtered, topic];
        }
      });
    }
  };

  // Handle type filter selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Convert Community data to card props
  const getCommunityCardProps = (community: Community) => {
    // Get the admin user's name
    const adminMember = community.members.find((e) => e.role == 'ADMIN');
    const hostName = adminMember
      ? `${adminMember.user.firstName} ${adminMember.user.lastName}`.trim() ||
        adminMember.user.username
      : 'Community Host';
    const avatarUrl =
      (adminMember?.user?.profilePictures as unknown as string) ||
      '/profile.jpg';
    return {
      title: community.name,
      desc: community.description || community.bio || '',
      members: `${community._count.members} Members`,
      price: community.isPaid ? `₹${community.subscriptionAmount}/m` : 'Free',
      host: hostName,
      img: community?.image || '',
      avatar: avatarUrl,
    };
  };

  return {
    // State
    selectedTopics,
    selectedType,
    searchQuery,
    communities,
    loading,
    loadingMore,
    error,
    hasNextPage,
    // Handlers
    handleTopicSelect,
    handleTypeSelect,
    handleSearch,
    getCommunityCardProps,
    loadMoreCommunities,
  };
}
