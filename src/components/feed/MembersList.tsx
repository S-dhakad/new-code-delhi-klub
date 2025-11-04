'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { useProfileStore } from 'src/store/profile.store';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';

type Member = { name: string; handle: string; avatar: string; meta?: string };

export default function MembersList({
  members,
  owner,
  username,
  communityId,
}: {
  members: Member[];
  owner?: string;
  username?: string;
  communityId: string;
}) {
  const { profile } = useProfileStore();

  return (
    <>
      <div className="flex items-center justify-between mt-5 mb-4">
        <div>
          <h3 className="text-sm font-medium text-[#000000]">
            Owned by{' '}
            <Link
              href={`/profile/${username}`}
              className="font-medium text-base text-[#000000] underline cursor-pointer"
            >
              {owner}
            </Link>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="hidden sm:inline-flex bg-[#0A5DBC] text-white rounded-[12px] text-base font-semibold hover:bg-[#053875] transition-colors duration-300"
            onClick={() =>
              copyToClipboardWithToast(`/klub-profile/${communityId}`)
            }
          >
            <Image src="/user-add.svg" alt="user icon" width={16} height={16} />
            Invite
          </Button>
        </div>
      </div>

      <article className="bg-white rounded-[20px] border border-[#ECECEC] mb-6">
        <div className="p-5">
          <div className="space-y-4">
            {members.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {m.avatar && (
                    <div className="w-11 h-11 rounded-[10px] overflow-hidden">
                      <Image
                        src={m.avatar}
                        alt={m.name}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full rounded-[10px]"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium text-[#000000]">
                      {m.name}
                    </div>
                    <div className="text-sm font-medium text-[#B5B5B5]">
                      {m.handle}
                    </div>
                  </div>
                </div>
                {profile?.username === username && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-0 cursor-pointer">
                      <Image
                        src="/threeDot.svg"
                        alt="more"
                        width={6}
                        height={22}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="py-2 px-3 rounded-[15px] left-auto"
                      align="start"
                      side="left"
                    >
                      <DropdownMenuItem className="p-1 font-medium text-sm text-[#DE0000] focus:text-[#DE0000] focus:bg-white cursor-pointer">
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
