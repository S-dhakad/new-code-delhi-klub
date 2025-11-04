'use client';
import React from 'react';
import TabsSwitcher from 'src/components/mobile/feed/TabsSwitcher';
import CourseCardDetailed from 'src/components/mobile/common/CourseCardDetailed';
import Link from 'next/link';
import { Course } from 'src/types/courses.types';
import CourseHeader from 'src/components/mobile/courses/CourseHeader';

// Type for user's community membership details
interface UserCommunity {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
}

interface MobileCoursesPageProps {
  courses: Course[];
  loading: boolean;
  myCourses: Course[];
  myLoading: boolean;
  userCommunity: UserCommunity | null;
}

const MobileCoursesPage: React.FC<MobileCoursesPageProps> = ({
  courses,
  loading,
  myCourses,
  myLoading,
  userCommunity,
}) => {
  const allCoursesContent = (
    <div className="pt-7 px-4 grid grid-cols-1 gap-10 bg-[#ECECEC]">
      {loading ? (
        <div className="text-center py-8 text-text-secondary">
          Loading courses...
        </div>
      ) : courses.length > 0 ? (
        courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${encodeURIComponent(course.id || '')}`}
            className="block"
          >
            <CourseCardDetailed
              imageSrc={
                (course.images && course.images[0]) ||
                (course.banner && course.banner[0]) ||
                '/thumbnail.jpg'
              }
              title={course.name || 'Untitled Course'}
              startedText={`Started ${course.publishedAt ? new Date(course.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}`}
              price={course.price || 0}
              currencySymbol={course.currency || '$'}
              ratingScore={course.rating || 5}
              ratingMax={5}
              description={course.description || ''}
              tags={course.tags || []}
            />
          </Link>
        ))
      ) : (
        <div className="text-center py-8 text-text-secondary">
          No courses found
        </div>
      )}
    </div>
  );

  const myCoursesContent = (
    <div className="pt-7 px-4 grid grid-cols-1 gap-10 bg-[#ECECEC]">
      {myLoading ? (
        <div className="text-center py-8 text-text-secondary">
          Loading courses...
        </div>
      ) : myCourses.length > 0 ? (
        myCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${encodeURIComponent(course.id || '')}`}
            className="block"
          >
            <CourseCardDetailed
              imageSrc={
                (course.images && course.images[0]) ||
                (course.banner && course.banner[0]) ||
                '/thumbnail.jpg'
              }
              title={course.name || 'Untitled Course'}
              startedText={`Started ${course.publishedAt ? new Date(course.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}`}
              price={course.price || 0}
              currencySymbol={course.currency || '$'}
              ratingScore={course.rating || 5}
              ratingMax={5}
              description={course.description || ''}
              tags={course.tags || []}
            />
          </Link>
        ))
      ) : (
        <div className="text-center py-8 text-text-secondary">
          No courses found
        </div>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-[480px] min-h-dvh bg-[#ECECEC] pb-24">
      <CourseHeader />
      <TabsSwitcher
        defaultIndex={0}
        items={[
          {
            title: 'All Courses',
            number: String(courses.length).padStart(2, '0'),
            component: allCoursesContent,
          },
          {
            title: 'My Courses',
            number: String(myCourses.length).padStart(2, '0'),
            component: myCoursesContent,
          },
        ]}
      />
    </main>
  );
};

export default MobileCoursesPage;
