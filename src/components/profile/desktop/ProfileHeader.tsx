import React from 'react';
import Link from 'next/link';

interface ProfileHeaderProps {
  isOwner: boolean;
}

export default function ProfileHeader({ isOwner }: ProfileHeaderProps) {
  return (
    <div className="border-b">
      <div className="container">
        <div className="pt-[30px] pb-[15px] flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-[#000000]">
            {isOwner ? 'My Profile' : 'Profile'}
          </Link>
          {isOwner && (
            <Link
              href="/setting/profile"
              type="button"
              className="rounded-[15px] border border-[#0A5DBC] text-[#0A5DBC] px-4 py-2 h-[40px] text-base font-medium"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
