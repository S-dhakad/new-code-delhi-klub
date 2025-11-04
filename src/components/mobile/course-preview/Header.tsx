import React from 'react';
import Link from 'next/link';

export type CoursePreviewHeaderProps = {
  courseName?: string;
  author?: string;
  description?: string;
  price?: string; // e.g. "$99"
  originalPrice?: string; // e.g. "$199"
  showActions?: boolean;
};

export default function CoursePreviewHeader({
  courseName,
  author,
  description,
  price = '$99',
  originalPrice = '$199',
  showActions = true,
}: CoursePreviewHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-semibold">{courseName}</h1>
      <p className="mt-1 text-sm font-medium">
        Author: <span className="font-semibold text-primary">{author}</span>
      </p>
      <p className="mt-2.5 text-sm font-semibold text-text-secondary">
        {description}
      </p>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="text-xl font-semibold">
          {price}{' '}
          <span className="text-sm text-text-secondary line-through">
            {originalPrice}
          </span>
        </div>
        <div className="px-2 py-1.5 rounded-[10px] text-xs font-semibold text-[#0D906B] bg-[#13B184] bg-opacity-10">
          50% off
        </div>
      </div>
    </div>
  );
}
