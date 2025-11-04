'use client';

import React, { Fragment } from 'react';

export default function CourseCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Fragment>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[20px] transition py-5 px-[15px] gap-0 border-0 bg-white shadow-sm animate-pulse"
        >
          <div className="relative h-[149px] w-full">
            <div className="w-full h-full rounded-[20px] bg-gray-200" />
            <div className="absolute right-3 bottom-3">
              <div className="w-[50px] h-[24px] rounded-full bg-gray-200" />
            </div>
          </div>

          <div className="pt-[18px] px-0">
            <div className="h-4 w-[80%] mb-2 rounded bg-gray-200" />
            <div className="h-3 w-[40%] mb-3 rounded bg-gray-200" />
            <div className="h-4 w-[60px] mb-2 rounded bg-gray-200" />
            <div className="h-3 w-[90%] mb-1 rounded bg-gray-200" />
            <div className="h-3 w-[75%] mb-4 rounded bg-gray-200" />
            <div className="flex gap-2 mt-4 flex-wrap">
              <div className="h-6 w-[50px] rounded-full bg-gray-200" />
              <div className="h-6 w-[60px] rounded-full bg-gray-200" />
              <div className="h-6 w-[45px] rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
}
