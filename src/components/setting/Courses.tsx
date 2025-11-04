'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';
import { useCommunityCourses } from 'src/hooks/settings/useCommunityCourses';

export default function Courses() {
  const [open, setOpen] = useState(false);
  const { courses, toggleCourse } = useCommunityCourses();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="courses" className="rounded-xl">
        <AccordionTrigger
          className={`px-6 py-4 hover:no-underline bg-white flex justify-between items-center ${
            open ? 'rounded-b-none rounded-t-[20px]' : 'rounded-[20px]'
          } [&>svg]:hidden`}
          onClick={() => setOpen(!open)}
        >
          <div className="text-base font-semibold text-[#000000]">Courses</div>
          <Image
            src="/downArrow.svg"
            width={24}
            height={24}
            alt="down arrow icon"
            className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </AccordionTrigger>

        <AccordionContent className="mt-4 bg-white border-t-2 border-[#0A5DBC] pb-0 rounded-b-[20px]">
          {/* responsive padding */}
          <div className="py-8 px-4 sm:px-10 space-y-6">
            {/* Description box */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <h3 className="text-base font-semibold text-[#000000]">
                  Description
                </h3>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Explain the value your courses provide
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="rounded-lg border px-4 py-4 bg-white shadow-sm">
                  <ul className="space-y-3 text-[#000000]">
                    <li className="flex items-start gap-3 text-[15px] font-medium">
                      <span className="mt-0.5">✅</span>
                      <span>
                        Easy-to-follow trainings on AI tools, automation, and
                        monetization
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-[15px] font-medium">
                      <span className="mt-0.5">✅</span>
                      <span>
                        Pre-built templates for lead gen, sales, and client
                        delivery
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-[15px] font-medium">
                      <span className="mt-0.5">✅</span>
                      <span>
                        Weekly coaching calls, Q&A sessions, and real-time
                        feedback
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-4" />

            {/* Helper text */}
            <div className="text-base text-[#787878] font-medium">
              Use the toggle switch to control the visibility of your courses on
              your Klub Profile
            </div>

            {/* Courses list */}
            <div className="space-y-5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-1"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-shrink-0">
                      <Image
                        src={course.images?.[0] ?? '/dummyProfile.png'}
                        alt={`${course.name}`}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-2xl object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#000000]">
                        {`${course.name}`}
                      </div>
                      <div className="text-sm font-medium text-[#787878] mt-1">
                        {`${course.createdAt}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center w-full sm:w-auto">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!course.visible}
                      aria-label={`Toggle visibility for ${course.name}`}
                      onClick={() =>
                        toggleCourse(course.id as unknown as number)
                      }
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-1">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-[#0A5DBC] flex items-center justify-center text-white text-2xl">
                    +
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#000000]">
                      Create new course
                    </div>
                    <div className="text-sm font-medium text-[#787878] mt-1">
                      The best time to start
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <Link
                    href="/create-course"
                    className="w-full sm:w-auto rounded-[15px] px-6 py-2 border-[#0A5DBC] text-[#0A5DBC] border font-semibold"
                  >
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
