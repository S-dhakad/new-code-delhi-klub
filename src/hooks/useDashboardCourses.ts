import { useEffect, useState } from 'react';
import { coursesService } from 'src/axios/courses/coursesApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { Course } from 'src/types/courses.types';

export function useDashboardCourses(communityId?: string, courseId?: string) {
  const [dashboardCourses, setDashboardCourses] = useState<Course[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<unknown>(null);
  const showToast = useToastStore((s) => s.showToast);

  const fetchCourses = async () => {
    if (!communityId || !courseId) return;

    try {
      setDashboardLoading(true);
      setDashboardError(null);

      const response = await coursesService.getDashboardCourses(
        communityId,
        courseId,
      );
      setDashboardCourses(response.data?.communityCoursePurchasedList ?? []);
    } catch (error) {
      console.error('Error in getting all courses:', error);
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error in getting all courses',
        message,
      });
      setDashboardError(error);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [communityId, courseId]);

  const refetch = () => {
    fetchCourses();
  };

  return { dashboardCourses, dashboardLoading, dashboardError, refetch };
}
