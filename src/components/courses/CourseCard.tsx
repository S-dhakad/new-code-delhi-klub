'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import Link from 'next/link';
import { Course } from 'src/types/courses.types';
import { formatCourseDate } from 'src/utils/formatDate';

export default function CourseCard({ course }: { course: Course }) {
  const getImageSrc = (course: Course) => {
    if (!course?.images?.[0]) return '/cardImage1.jpg';

    const firstImage = course.images[0];
    return typeof firstImage === 'string'
      ? firstImage
      : (firstImage as { url: string }).url;
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="rounded-[20px] transition py-5 px-[15px] gap-0 border-0">
        <div className="relative h-[149px] w-full">
          <Image
            src={getImageSrc(course)}
            alt={`${course.name}`}
            fill
            className="w-full object-cover h-[149px] rounded-[20px]"
          />
          {course.rating && (
            <div className="absolute right-3 bottom-3 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-[#000000]">
                {course.rating}
              </span>
            </div>
          )}
        </div>

        <CardContent className="pt-[18px] px-0">
          <h3 className="text-base font-semibold text-[#000000] mb-1 line-clamp-2">
            {course.name}
          </h3>
          {course.createdAt && (
            <p className="text-xs font-medium text-[#787878] mb-2">
              {formatCourseDate(course.createdAt.toString())}
            </p>
          )}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-lg font-semibold text-[#000000]">
                {course.currency} {course.price}
              </p>
              <p className="text-xs font-medium text-[#787878] mt-1 line-clamp-2">
                {course.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {course.tags?.map((tag) => (
              <Badge
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium text-[#000000] bg-[#E6EFF8]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
