'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from 'src/components/ui/dropdown-menu';

export default function NotificationsDropdown() {
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
            src={open ? '/notificationsBlue.svg' : '/notificationsInactive.svg'}
            alt="notifications icon"
            width={22}
            height={22}
            className="w-[22px] h-[22px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 py-2 px-5 mb-5 rounded-[20px] "
      >
        <div className="bg-white rounded-xl overflow-hidden w-full">
          {/* Header */}
          <div className="flex items-center justify-between py-3 border-b border-[#ECECEC]">
            <div className="flex items-center gap-2">
              <Image
                src="/notificationsInactive.svg"
                alt="bell"
                width={20}
                height={20}
              />
              <span className="font-medium text-base text-[#787878]">
                Notifications
              </span>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Notifications list */}
          <div className="divide-y">
            {/* 1. Onboarding */}
            <div className="flex gap-3 py-3 px-0">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                <Image
                  src="/profile-2user.svg"
                  alt="onboarding"
                  width={18}
                  height={18}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#000000]">
                  Welcome to Klub. Complete your profile to get started
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  18 days ago
                </div>
                <Button className="mt-3 h-[34px] px-2 text-xs font-medium bg-[#0A5DBC] text-white rounded-[10px] hover:bg-[#053875] transition-colors duration-300">
                  Finish Profile
                </Button>
              </div>
            </div>

            {/* 2. Follow notification */}
            <div className="flex gap-3 py-3">
              <Image
                src="/community-profile.jpg"
                alt="Pang Vang"
                width={40}
                height={40}
                className="rounded-xl h-11"
              />
              <div className="flex-1">
                <p className="text-sm text-[#000000]">
                  <span className="font-semibold">Pang Vang</span> followed you
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  6 days ago
                </div>
                <Button className="mt-3 h-[34px] px-2 text-xs font-medium bg-[#0A5DBC] text-white rounded-[10px] hover:bg-[#053875] transition-colors duration-300">
                  Follow back
                </Button>
              </div>
            </div>

            {/* 3. Mention */}
            <div className="flex gap-3 py-3">
              <Image
                src="/community-profile.jpg"
                alt="Jonathan"
                width={40}
                height={40}
                className="rounded-xl h-11"
              />
              <div className="flex-1">
                <p className="text-sm text-[#000000]">
                  <span className="font-semibold">Jonathan Sidwell</span>{' '}
                  mentioned you
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  6 days ago
                </div>
              </div>
            </div>

            {/* 4. Like */}
            <div className="flex gap-3 py-3">
              <Image
                src="/community-profile.jpg"
                alt="Gaurang"
                width={40}
                height={40}
                className="rounded-xl h-11"
              />
              <div className="flex-1">
                <p className="text-sm text-[#000000]">
                  <span className="font-semibold">Gaurang Gaikwad</span> liked
                  your post
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  6 days ago
                </div>
              </div>
            </div>

            {/* 5. Comment */}
            <div className="flex gap-3 py-3">
              <Image
                src="/community-profile.jpg"
                alt="Maz"
                width={40}
                height={40}
                className="rounded-xl h-11"
              />
              <div className="flex-1">
                <p className="text-sm text-[#000000]">
                  <span className="font-semibold">Maz Person (Admin)</span>{' '}
                  commented your post
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  6 days ago
                </div>
              </div>
            </div>

            {/* 6. New post */}
            <div className="flex gap-3 py-3">
              <Image
                src="/community-profile.jpg"
                alt="Neha"
                width={44}
                height={44}
                className="rounded-xl h-11"
              />
              <div className="flex-1">
                <p className="text-sm text-[#000000]">
                  <span className="font-semibold">Neha</span> has added a new
                  post to <span className="font-semibold">#wins</span>
                </p>
                <div className="text-sm font-medium text-[#787878]">
                  6 days ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
