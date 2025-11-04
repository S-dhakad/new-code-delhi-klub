import { useEffect, useState } from 'react';
import { communityService } from 'src/axios/community/communityApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Course } from 'src/types/courses.types';

interface UseDashboardSubscriptionsResult {
  subscriptionsReported: Course[];
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

export function useDashboardSubscriptions(
  communityId?: string,
): UseDashboardSubscriptionsResult {
  const [subscriptionsReported, setSubscriptionsReported] = useState<Course[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const showToast = useToastStore((s) => s.showToast);

  const fetchSubscriptions = async () => {
    if (!communityId) {
      setSubscriptionsReported([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        await communityService.getCommunityDashboardReported(communityId);
      setSubscriptionsReported(response.data?.userCommunities ?? []);
    } catch (error) {
      console.error('Error fetching dashboard reported:', error);
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error loading courses',
        message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptionsReported,
    loading,
    error,
    refetch: fetchSubscriptions,
  };
}
