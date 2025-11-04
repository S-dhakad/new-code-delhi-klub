import { useEffect, useState } from 'react';
import { coursesService } from 'src/axios/courses/coursesApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Course } from 'src/types/courses.types';

export function useMyCourses(communityId?: string) {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState<unknown>(null);
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (!communityId) return;

    const fetchCourses = async () => {
      try {
        setMyLoading(true);
        setMyError(null);

        const response = await coursesService.getMyCourses(communityId);
        setMyCourses(response.data?.courses ?? []);
      } catch (error) {
        console.error('Error in getting all courses:', error);
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error in getting all courses',
          message,
        });
        setMyError(error);
      } finally {
        setMyLoading(false);
      }
    };

    fetchCourses();
  }, [communityId]);

  return { myCourses, myLoading, myError };
}
