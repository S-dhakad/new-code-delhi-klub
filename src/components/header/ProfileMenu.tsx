'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from 'src/components/ui/dropdown-menu';
import { profileService } from 'src/axios/profile/profileApi';
import { useProfileStore } from 'src/store/profile.store';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuthStore } from 'src/store/auth.store';

export default function ProfileMenu() {
  const { profile, setProfile } = useProfileStore();
  const [open, setOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleViewProfile = () => {
    setOpen(false);
    router.push(`/profile`);
  };
  const signOutHandler = () => {
    logout();
    setProfile(null);

    router.push('/');
  };
  if (!profile) {
    return <>Loading...</>;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          {profile.profilePicture && (
            <div className="w-11 h-11 rounded-xl overflow-hidden">
              <Image
                src={`${profile.profilePicture}`}
                alt="Profile pic"
                width={44}
                height={44}
                className="object-cover w-[44px] h-[44px]"
              />
            </div>
          )}
          <div className="hidden md:flex flex-col text-left max-w-[170px]">
            <span className="text-base font-semibold text-[#000000] line-clamp-1 w-full">
              {profile.firstName} {profile.lastName}
            </span>
            <span className="text-sm font-medium text-[#000000] line-clamp-1 w-full">
              {profile.username}
            </span>
          </div>
          <div className="hidden md:flex items-center">
            <Image
              src="/downArrowFill.svg"
              alt="dropdown icon"
              width={24}
              height={24}
              className="w-[24px] h-[24px]"
            />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-0 mb-5 rounded-[20px] w-[244px]"
      >
        <div className="bg-white rounded-xl overflow-hidden w-full">
          <div className="h-[204] w-full relative p-1">
            {profile?.profilePicture && (
              <Image
                src={profile.profilePicture}
                alt="Profile pic"
                fill
                className="object-cover rounded-t-[20px] static"
              />
            )}
          </div>

          <div className="p-4">
            <h4 className="text-base font-medium text-[#000000]">
              {profile.firstName} {profile.lastName}
            </h4>
            <p className="text-xs font-medium text-[#000000] mt-1 line-clamp-2">
              {profile.bio}
            </p>

            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6z" />
                </svg>
                <span className="text-xs font-medium text-[#000000]">
                  {profile?.followers
                    ? profile.followers >= 1000
                      ? `${(profile.followers / 1000).toFixed(1).replace(/\.0$/, '')}k`
                      : profile.followers
                    : 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.86 13.72 18 14.79 18 16v3h4v-2.5C22 14.17 17.33 13 16 13z" />
                </svg>
                <span className="text-xs font-medium text-[#000000]">860</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => signOutHandler()}
                className="text-sm text-red-600 hover:underline"
              >
                Sign out
              </button>

              <Button
                onClick={() => handleViewProfile()}
                className="rounded-[15px] h-[34px] px-4 text-sm font-medium text-white bg-[#0A5DBC] hover:bg-[#053875] transition-colors duration-300"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
