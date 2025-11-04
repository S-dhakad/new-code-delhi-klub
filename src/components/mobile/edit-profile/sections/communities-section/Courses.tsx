'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCommunityCourses } from 'src/hooks/settings/useCommunityCourses';

const Courses = () => {
  const { courses, toggleCourse } = useCommunityCourses();

  return (
    <div className="p-5 space-y-5">
      {/* Description */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Description</label>
          <p className="font-medium text-sm text-text-secondary">
            Explain the value your courses provide
          </p>
        </div>

        <div className="rounded-2xl border px-4 py-4 bg-white shadow-sm border-[#ECECEC]">
          <ul className="space-y-3 text-[#000000]">
            <li className="flex items-start gap-3 text-sm font-medium">
              <span className="mt-0.5">✅</span>
              <span>
                Easy-to-follow trainings on AI tools, automation, and
                monetization
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm font-medium">
              <span className="mt-0.5">✅</span>
              <span>
                Pre-built templates for lead gen, sales, and client delivery
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm font-medium">
              <span className="mt-0.5">✅</span>
              <span>
                Weekly coaching calls, Q&A sessions, and real-time feedback
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200" />

      {/* Helper text */}
      <div className="text-sm text-text-secondary font-medium">
        Use the toggle switch to control the visibility of your courses on your
        Klub Profile
      </div>

      {/* Courses list */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <Image
                  src={course.images?.[0] ?? '/dummyProfile.png'}
                  alt={`${course.name}`}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-2xl object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[#000000] truncate">
                  {`${course.name}`}
                </div>
                <div className="text-sm font-medium text-text-secondary mt-1">
                  {`${course.createdAt}`}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                role="switch"
                aria-checked={!!course.visible}
                aria-label={`Toggle visibility for ${course.name}`}
                onClick={() => toggleCourse(course.id as unknown as number)}
                className={`relative inline-flex items-center w-14 h-6 p-0 rounded-full ${!!course.visible ? 'bg-gray-200' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full shadow transform transition-transform ${
                    !!course.visible
                      ? 'translate-x-[36px] bg-[#0A5DBC]'
                      : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}

        {/* Create new course row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#0A5DBC] flex items-center justify-center text-white text-2xl">
              +
            </div>
            <div>
              <div className="text-sm font-semibold text-[#000000]">
                Create new course
              </div>
              <div className="text-sm font-medium text-text-secondary mt-1">
                The best time to start
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/create-course"
              className="rounded-2xl px-4 py-2 border-[#0A5DBC] text-[#0A5DBC] border font-semibold text-sm"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
