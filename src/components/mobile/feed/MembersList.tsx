'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Card } from 'src/components/ui/card';
import { MoreVertical, UserPlus } from 'lucide-react';
import { useToastStore } from 'src/store/toast.store';
import { useFeedData } from 'src/hooks/useFeedData';
interface Member {
  name: string;
  handle: string;
  avatar: string;
  meta: string;
}

interface MembersListProps {
  members?: Member[];
  owner?: string;
}

export default function MembersList({
  members = [],
  owner = 'Community Owner',
}: MembersListProps) {
  const { community } = useFeedData();
  const showToast = useToastStore((s) => s.showToast);
  const handleShareClick = () => {
    const url = `${window.location.origin}/klub-profile/${community?.id}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast({
        type: 'default-success',
        title: 'Profile link copied to clipboard!',
        message: `${window.location.origin}/klub-profile/${community?.id}`,
      });
    });
  };
  return (
    <section className="p-4 bg-[#ECECEC]">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Owned by <span className="text-base underline">{owner}</span>
        </div>
        <Button
          size="sm"
          className="rounded-xl gap-2 text-white flex items-center"
          onClick={handleShareClick}
        >
          {/* We might need to change the icon  */}
          <UserPlus className="h-4 w-4" /> Invite
        </Button>
      </div>

      {/* List card */}
      <Card className="mt-4 rounded-[20px] p-5 bg-white border-border-stroke-regular">
        <ul className="flex flex-col gap-4">
          {members.map((m, idx) => (
            <li
              key={`${m.name}-${idx}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={44}
                  height={44}
                  className="rounded-[10px] object-cover aspect-square"
                />
                <div>
                  <div className="text-base font-medium leading-tight">
                    {m.name}
                  </div>
                  <div className="text-sm text-text-secondary font-medium mt-1.5">
                    {m.handle}
                  </div>
                </div>
              </div>
              <button className="">
                <MoreVertical className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
