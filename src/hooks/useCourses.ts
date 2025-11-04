import { useEffect, useState } from 'react';
import { coursesService } from 'src/axios/courses/coursesApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Course } from 'src/types/courses.types';

export function useCourses(communityId?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (!communityId) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await coursesService.getAllCourse(communityId);
        setCourses(response.data?.courses ?? []);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error in getting all courses',
          message,
        });
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [communityId]);

  return { courses, loading, error };
}
