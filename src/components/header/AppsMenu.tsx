'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';

export default function AppsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
      <DropdownMenuTrigger asChild>
        <Button
          className={`rounded-[10px] h-auto p-3 flex items-center gap-2 focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none
            ${open ? 'border-blue-300 bg-[#E6EFF8] hover:bg-[#E6EFF8]' : 'bg-white hover:bg-white'}
            transition-colors`}
        >
          <Image
            src={open ? '/menuBlue.svg' : '/menuInactive.svg'}
            alt="more icon"
            width={22}
            height={22}
            className="w-[22px] h-[22px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mb-5 py-5 px-[30px] rounded-[20px]"
      >
        <div className="bg-white rounded-xl overflow-hidden w-[230px]">
          <div className="px-0 py-1 pb-2 border-b flex items-center justify-between">
            <div className="font-medium text-base text-[#787878]">
              <Image
                src="/menuInactive.svg"
                alt="apps icon"
                width={20}
                height={20}
                className="inline-block mr-2"
              />
              Apps
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="pt-4">
            <DropdownMenuItem className="flex items-center gap-3 px-0 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-black font-medium text-base">
              <Image
                src="/Circle.svg"
                alt="klub pay icon"
                width={22}
                height={22}
                className="object-cover"
              />
              <span>Spin the Wheel</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-0 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-black font-medium text-base">
              <Image
                src="/aim.svg"
                alt="klub pay icon"
                width={22}
                height={22}
                className="object-cover"
              />
              <span>Challenges</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-0 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-black font-medium text-base">
              <Image
                src="/web.svg"
                alt="klub pay icon"
                width={22}
                height={22}
                className="object-cover"
              />
              <span>Web page</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-0 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-black font-medium text-base">
              <Image
                src="/Group 38.svg"
                alt="klub pay icon"
                width={22}
                height={22}
                className="object-cover"
              />
              <span>Affiliate program</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-0 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-black font-medium text-base">
              <Image
                src="/upward.svg"
                alt="klub pay icon"
                width={22}
                height={22}
                className="object-cover"
              />
              <span>Leaderboard</span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
