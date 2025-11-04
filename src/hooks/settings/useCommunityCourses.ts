import { useState, useEffect } from 'react';
import { useCommunityStore } from 'src/store/community.store';
import { useCourses } from 'src/hooks/useCourses';
import { Course } from 'src/types/courses.types';

export const useCommunityCourses = () => {
  const { community } = useCommunityStore();
  const { courses, loading, error } = useCourses(community?.id);
  const [localCourses, setLocalCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (courses && Array.isArray(courses)) {
      setLocalCourses(
        courses.map((c: Course) => ({ ...c, visible: c.visible ?? true })),
      );
    }
  }, [courses]);

  const toggleCourse = (id: number | string) => {
    setLocalCourses((prev) =>
      prev.map((course) =>
        String(course.id) === String(id)
          ? { ...course, visible: !course.visible }
          : course,
      ),
    );
  };

  return {
    community,
    courses: localCourses,
    loading,
    error,
    toggleCourse,
  };
};
