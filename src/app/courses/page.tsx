'use client';

import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { coursesService } from 'src/axios/courses';
import CourseCard from 'src/components/courses/CourseCard';

import { useCourses } from 'src/hooks/useCourses';
import { useMyCourses } from 'src/hooks/useMyCourses';
import { useCommunityStore } from 'src/store/community.store';
import { useProfileStore } from 'src/store/profile.store';
import { Course } from 'src/types/courses.types';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileCoursesPage } from 'src/mobile-pages';
import CourseCardSkeleton from 'src/components/skeletons/CourseCardSkeleton';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'allCourses' | 'myCourses'>(
    'allCourses',
  );
  const isMobile = useIsMobile();
  const { community, userCommunity } = useCommunityStore();
  const { courses, loading, error } = useCourses(community?.id);
  const { myCourses, myLoading, myError } = useMyCourses(community?.id);
  if (isMobile) {
    return (
      <MobileCoursesPage
        courses={courses}
        loading={loading}
        myCourses={myCourses}
        myLoading={myLoading}
        userCommunity={userCommunity}
      />
    );
  }

  return (
    <Fragment>
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:pt-[30px] sm:pb-[15px]">
            <h1 className="w-full sm:w-auto text-xl sm:text-xl font-semibold leading-tight text-[#000000]">
              Classroom
            </h1>
            {userCommunity?.role === 'ADMIN' && (
              <div className="w-full sm:w-auto flex justify-start sm:justify-end">
                <Link
                  href="/create-course"
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-[15px] bg-[#0A5DBC] text-white px-4 py-2 text-base font-semibold transition-colors duration-300 hover:bg-[#053875]"
                  aria-label="Create course"
                >
                  + Create course
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="container" role="tablist" aria-label="Course tabs">
          <div className="pt-[30px] w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* All Courses Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'allCourses'}
              aria-controls="panel-all"
              onClick={() => setActiveTab('allCourses')}
              className={`relative pb-2 border-b-2 text-base font-semibold text-left sm:text-center ${
                activeTab === 'allCourses'
                  ? 'text-[#0A5DBC] border-[#0A5DBC]'
                  : 'text-[#787878] border-transparent'
              }`}
            >
              All Courses
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded ${
                  activeTab === 'allCourses'
                    ? 'bg-[#0A5DBC] text-white'
                    : 'text-[#787878] bg-white border border-[#E6E6E6]'
                }`}
              >
                {courses.length}
              </span>
            </button>

            {/* My Courses Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'myCourses'}
              aria-controls="panel-my"
              onClick={() => setActiveTab('myCourses')}
              className={`relative pb-2 border-b-2 text-base font-semibold text-left sm:text-center ${
                activeTab === 'myCourses'
                  ? 'text-[#0A5DBC] border-[#0A5DBC]'
                  : 'text-[#787878] border-transparent'
              }`}
            >
              My Courses
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded ${
                  activeTab === 'myCourses'
                    ? 'bg-[#0A5DBC] text-white'
                    : 'text-[#787878] bg-white border border-[#E6E6E6]'
                }`}
              >
                {myCourses.length}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-8">
        <div
          id="panel-all"
          role="tabpanel"
          aria-hidden={activeTab !== 'allCourses'}
          className={activeTab === 'allCourses' ? 'block' : 'hidden'}
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CourseCardSkeleton count={6} />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course: Course, index: number) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div>Course Not Found</div>
          )}
        </div>

        {/* MY COURSES PANEL */}
        <div
          id="panel-my"
          role="tabpanel"
          aria-hidden={activeTab !== 'myCourses'}
          className={activeTab === 'myCourses' ? 'block' : 'hidden'}
        >
          {/* {COURSESPROGRESS.map((course) => (
              <CourseCardProgress key={course.id} course={course} />
            ))} */}

          {myLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CourseCardSkeleton count={6} />
            </div>
          ) : myCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myCourses.map((course: Course, index: number) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div>Course Not Found</div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
