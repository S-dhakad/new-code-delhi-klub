import React from 'react';
import Image from 'next/image';
import Tags from './Tags';

export type MobileCourseCardProps = {
  imageSrc: string;
  title: string;
  description?: string;
  tags?: string[];
};

export default function CourseCard({
  imageSrc,
  title,
  description,
  tags,
}: MobileCourseCardProps) {
  return (
    <div className="rounded-[20px] p-5 bg-white overflow-hidden">
      <div className="relative w-full h-[152px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover rounded-[20px]"
        />
      </div>
      <div className="mt-3">
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{title}</div>
          <div className="text-xs font-medium text-text-secondary">
            Created April, 13th, 2024
          </div>
          {/* Tags / Chips container */}
          <Tags items={tags} />
        </div>
        {description ? (
          <p className="mt-[14px] text-sm font-medium text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
