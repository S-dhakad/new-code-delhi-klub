'use client';

import React from 'react';
import Image from 'next/image';
import { Home, Play, SquarePen, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px]">
      <div className="mx-4 mb-3 rounded-2xl border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-5 items-center">
          <button className="flex flex-col items-center gap-1 py-3 text-gray-500">
            <Play className="h-5 w-5" />
            <span className="text-xs font-medium">Reels</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 text-gray-500">
            <SquarePen className="h-5 w-5" />
            <span className="text-xs font-medium">Create</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 text-blue-600">
            <Home className="h-5 w-5" />
            <span className="text-xs font-semibold">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Me</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 text-gray-500">
            <Image
              src="/default-avatar.png"
              alt="you"
              width={20}
              height={20}
              className="rounded-md"
            />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
