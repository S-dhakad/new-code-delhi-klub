'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Course } from 'src/types/courses.types';
import Link from 'next/link';
import { formatCourseDate } from 'src/utils/formatDate';

export default function KlubCourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="cursor-pointer">
      <Card className="rounded-[20px] border-0 transition py-4 px-4 gap-0">
        <div className="relative w-full h-[152px] rounded-[20px] overflow-hidden">
          <Image
            src={
              Array.isArray(course?.images) && course.images.length > 0
                ? course.images[0]
                : '/cardImage1.jpg'
            }
            alt={`${course.name}`}
            fill
            className="object-cover w-full h-full rounded-[20px]"
          />
          {course.rating && (
            <div className="absolute right-3 bottom-3 bg-white rounded-[10px] px-3 py-1 flex items-center gap-2 shadow">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-[#000000]">
                {course.rating}
              </span>
            </div>
          )}
        </div>

        <CardContent className="pt-4 px-0">
          <h3 className="text-base font-semibold text-[#000000] mb-1 line-clamp-2">
            {`${course.name}`}
          </h3>
          <p className="text-xs font-medium text-[#787878] mb-2">
            {formatCourseDate(course.createdAt?.toString())}
          </p>
          <div className="flex gap-2 mt-1 mb-2 flex-wrap">
            {course.tags?.map((t) => (
              <Badge
                key={t}
                className="rounded-[8px] px-3 py-1 bg-[#E6EFF8] text-xs font-medium text-[#000000]"
              >
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-[#787878] mt-1 line-clamp-2">
                {course.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
