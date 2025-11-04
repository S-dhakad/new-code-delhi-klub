'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from 'src/components/ui/popover';
import { Course } from 'src/types/courses.types';

interface CourseSelectorProps {
  selected: Course;
  courses: Course[];
  onSelect: (course: Course) => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  selected,
  courses,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (course: Course) => {
    onSelect(course);
    setOpen(false); // 👈 close dropdown after selection
  };

  const getImageSrc = (course: Course) => {
    if (!course?.images?.[0]) return '/cardImage1.jpg';

    const firstImage = course.images[0];
    return typeof firstImage === 'string'
      ? firstImage
      : (firstImage as { url: string }).url;
  };

  return (
    <div className="w-full sm:max-w-[458px] mb-[30px]">
      <label className="block text-base font-medium text-[#000000] mb-5">
        Select a Course
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between rounded-[20px] bg-white px-[15px] py-[10px] shadow-sm border border-[#ECECEC] h-[56px] hover:bg-white text-base font-medium text-[#000000]"
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden flex-shrink-0 object-cover">
                <Image
                  src={getImageSrc(selected)}
                  alt={selected?.name || ''}
                  width={36}
                  height={36}
                  className="object-cover rounded-[10px] w-9 h-9"
                />
              </div>
              <div className="text-sm font-medium text-slate-900">
                {selected?.name}
              </div>
              <Image
                src="/downArrow.svg"
                alt="down arrow"
                width={18}
                height={18}
                className="object-cover h-[18px] w-[18px]"
              />
            </div>
            <div>
              <Badge
                className={`rounded-full px-2 py-1 text-xs ${
                  selected?.isActive
                    ? 'rounded-[10px] py-2 px-[18px] border border-[#9BF89B] bg-[#DFFDDF] text-[#007B00] text-sm font-medium h-[33px]'
                    : 'rounded-[10px] py-2 px-[18px] border border-[#FFB8B8] bg-[#FCDCDC] text-[#DE0000] text-sm font-medium h-[33px]'
                }`}
              >
                {selected?.isActive ? 'Published' : 'Unpublished'}
              </Badge>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className="w-[--radix-popover-trigger-width] sm:w-[293px] p-0 rounded-[20px] shadow-lg border border-[#ECECEC] overflow-hidden"
        >
          <h5 className="p-5 pb-4 text-sm font-medium text-[#787878]">
            Select a Course
          </h5>
          <div className="p-5 pt-0 space-y-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleSelect(course)}
                className={`flex items-center gap-[10px] w-full text-left`}
              >
                <div className="w-[36] h-[36px] object-cover rounded-[10px] overflow-hidden flex-shrink-0">
                  <Image
                    src={getImageSrc(course)}
                    alt={course.name || ''}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#000000]">
                    {course.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
