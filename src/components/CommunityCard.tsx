// src/components/klub/CommunityCard.tsx
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from 'src/components/ui/card';

export type CommunityCardProps = {
  title: string;
  desc: string;
  members: string;
  price: string;
  host: string;
  img: string;
  avatar: string;
};

export default function CommunityCard({
  title,
  desc,
  members,
  price,
  host,
  img,
  avatar,
}: CommunityCardProps) {
  return (
    <Card className="rounded-[20px] overflow-hidden p-4 bg-[#F6F6F6] border-0 gap-0">
      <div className="relative h-[152px] w-full">
        {img && typeof img === 'string' && img.trim() !== '' && (
          <Image
            alt={title}
            src={img}
            fill
            className="object-cover rounded-[20px] w-full"
          />
        )}
      </div>

      <CardContent className="py-4 px-0">
        <h3 className="text-base font-semibold  text-[#000000] line-clamp-1">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#787878] line-clamp-2 min-h-10">
          {desc}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#000000]">{members}</span>
          <span className="text-base font-semibold text-[#000000]">
            {price}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-0 pt-[14px] border-t border-[#ECECEC]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8">
            {avatar && typeof avatar === 'string' && avatar.trim() !== '' ? (
              <Image
                src={avatar}
                alt={host}
                width={32}
                height={32}
                className="h-8 w-8 rounded-[10px] object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {host?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <span className="text-base font-medium test-[#000000]">{host}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
