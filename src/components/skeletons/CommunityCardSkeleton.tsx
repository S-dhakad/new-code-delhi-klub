'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from 'src/components/ui/card';

interface CommunityCardSkeletonProps {
  count?: number;
}

const CommunityCardSkeleton = ({ count = 1 }: CommunityCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="rounded-[20px] overflow-hidden p-4 bg-[#F6F6F6] border-0 animate-pulse"
        >
          <div className="relative h-[152px] w-full bg-gray-200 rounded-[20px]" />
          <CardContent className="py-4 px-0 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="flex items-center justify-between mt-4">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/5" />
            </div>
          </CardContent>

          <CardFooter className="px-0 pt-[14px] border-t border-[#ECECEC] mt-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-[10px] bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default CommunityCardSkeleton;
