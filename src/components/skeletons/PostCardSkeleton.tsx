import React from 'react';

const PostCardSkeleton = () => {
  return (
    <article className="bg-white rounded-[20px] border border-[#ECECEC] overflow-hidden mb-6 animate-pulse">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-[10px] bg-gray-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        </div>
        <div className="mt-4 flex gap-3 overflow-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[311px] h-[189px] rounded-[10px] bg-gray-200 flex-shrink-0"
            ></div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-5">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </article>
  );
};

export default PostCardSkeleton;
