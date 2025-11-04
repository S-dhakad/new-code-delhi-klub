'use client';
import Image from 'next/image';
import { Card, CardContent } from 'src/components/ui/card';
import { Separator } from 'src/components/ui/separator';
import { Button } from '../ui/button';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';

interface ProfilePreviewProps {
  fullName: string;
  username: string;
  bio: string;
  avatar: string;
  joinedDate: string;
}

export default function ProfilePreview({
  fullName,
  username,
  bio,
  avatar,
  joinedDate,
}: ProfilePreviewProps) {
  return (
    <section className="flex flex-col px-[38px] py-[50]">
      <Card className="rounded-[20px] border border-[#ECECEC] bg-white p-[42px]">
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[133px] w-[133px] overflow-hidden rounded-[15px] border-2 border-[#0A5DBC] bg-white p-[6px]">
              <Image
                src={avatar}
                alt={fullName}
                width={120}
                height={120}
                className="object-cover h-full w-full rounded-[15px]"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-[#000000]">
                {fullName}
              </h3>
              <p className="mt-1 text-sm text-[#787878] font-medium">
                @{username}
              </p>
              <p className="mt-[10px] text-xs text-[#787878] font-medium">
                Joined {joinedDate}
              </p>
            </div>
            <Separator className="my-4 bg-[#ECECEC]" />
            <p className="text-sm text-[#000000] font-medium line-clamp-4">
              {bio || 'Tell people about yourself...'}
            </p>
          </div>
        </CardContent>
      </Card>
      <Button
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-[15px] border border-[#ECECEC] px-4 text-sm font-medium text-[#0A5DBC] bg-white h-11"
        type="button"
        onClick={() => copyToClipboardWithToast(`/profile/${username}`)}
      >
        <Image src="/shareIcon.svg" alt="Share" width={16} height={16} />
        Share profile
      </Button>
    </section>
  );
}
