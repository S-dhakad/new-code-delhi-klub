import { useEffect, useState, useCallback } from 'react';
import { featuredPostService } from 'src/axios/profile/profileApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Post } from 'src/types/post.types';

export function useFeaturedPosts(communityId?: string) {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [trigger, setTrigger] = useState<number>(0);
  const showToast = useToastStore((s) => s.showToast);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!communityId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await featuredPostService.getFeaturedPost(communityId);
        if (!isMounted) return;
        setData(res?.data ?? []);
      } catch (error) {
        if (!isMounted) return;
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error fetching featured post',
          message,
        });
        setError(error);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [communityId, trigger]);

  return { data, loading, error, refetch } as const;
}

export default useFeaturedPosts;
