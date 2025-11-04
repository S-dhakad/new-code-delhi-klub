'use client';

import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Button } from 'src/components/ui/button';

// UI-only replica of header/ProfileMenu.tsx card, with dummy data
const ProfileCard: React.FC = () => {
  // Dummy data matching the header UI
  const firstName = 'Paula';
  const lastName = 'Agard';
  const username = '@paula';
  const bio = 'I teach people how to make money with AI bots and automation.';
  const profilePicture = '/feedImage.jpg';
  const followers = 2048;
  const following = 860;

  return (
    <div className="w-[244px] p-1 rounded-[20px] bg-white shadow-lg">
      <div className="relative w-full h-52 overflow-hidden rounded-t-[20px]">
        <Image
          src={profilePicture}
          alt="Profile pic"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-4 pb-5">
        <h4 className="text-base font-medium">
          {firstName} {lastName}
        </h4>
        <p className="text-xs font-medium mt-2">{bio}</p>

        <div className="flex items-center gap-3 mt-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-text-secondary" />
            <span>{followers}</span>
          </div>

          <div className="flex items-center gap-0.5">
            <User className="w-4 h-4 text-text-secondary" />
            <span>{following}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-8">
          <Button
            variant="outline"
            className="text-sm font-medium text-red-600 hover:underline border-none px-2"
          >
            Sign out
          </Button>

          <Button
            variant="default"
            className="rounded-[15px] px-3 py-2 text-sm font-medium"
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
