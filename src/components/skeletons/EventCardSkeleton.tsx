'use client';

import React from 'react';

interface EventCardSkeletonProps {
  count?: number;
}

/**
 * EventCardSkeleton
 * Pure Tailwind loading skeleton that mirrors the real EventCard layout:
 * - left date column (month / day / weekday)
 * - vertical divider (hidden on small screens)
 * - main content (title, badge, meta, description, icon rows)
 * - actions on the right (edit dropdown + join button)
 *
 * Pass `count` prop to render multiple skeletons:
 * <EventCardSkeleton count={3} />
 */
export default function EventCardSkeleton({
  count = 3,
}: EventCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-[20px] border border-[#ECECEC] py-6 px-[30px] bg-white shadow-sm animate-pulse"
          role="status"
          aria-busy="true"
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="flex w-full sm:w-auto items-start sm:items-center gap-4">
              {/* Date column */}
              <div className="flex flex-col text-center justify-between min-w-[64px]">
                <div className="h-4 w-[48px] rounded bg-gray-200 mx-auto" />
                <div className="h-[40px] w-[56px] rounded bg-gray-200 mx-auto my-1" />
                <div className="h-3 w-[52px] rounded bg-gray-200 mx-auto" />
              </div>

              {/* vertical divider hidden on small screens */}
              <div className="hidden sm:block bg-[#ECECEC] mx-[20px] w-[1px] h-16" />

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* title */}
                      <div className="h-5 w-72 rounded bg-gray-200" />
                      {/* recurring badge */}
                      <div className="h-5 w-20 rounded-full bg-gray-200" />
                    </div>

                    {/* community / host */}
                    <div className="mt-1">
                      <div className="h-3 w-80 rounded bg-gray-200" />
                    </div>

                    {/* description */}
                    <div className="mt-[10px]">
                      <div className="h-4 w-full max-w-[720px] rounded bg-gray-200 mb-2" />
                      <div className="h-4 w-[70%] max-w-[520px] rounded bg-gray-200" />
                    </div>

                    {/* icon rows: time / duration / location */}
                    <div className="mt-[10px] flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-gray-200" />
                        <div className="h-4 w-24 rounded bg-gray-200" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-gray-200" />
                        <div className="h-4 w-20 rounded bg-gray-200" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-gray-200" />
                        <div className="h-4 w-28 rounded bg-gray-200" />
                      </div>

                      {/* admin pill */}
                      <div className="hidden sm:block">
                        <div className="h-6 w-[92px] rounded-xl bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons: inline on sm+, stacked on mobile */}
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
              <div className="h-10 w-full sm:w-[52px] rounded-[10px] bg-gray-200" />
              <div className="h-10 w-full sm:w-[82px] rounded-[10px] bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
