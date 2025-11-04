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
    <Card className="rounded-[20px] overflow-hidden hover:shadow-sm transition p-4 bg-[#F6F6F6] border-0 gap-0">
      <div className="relative h-44">
        <Image
          alt={title}
          src={img}
          fill
          className="object-cover rounded-[20px]"
        />
      </div>

      <CardContent className="py-4 px-0">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm font-medium text-text-secondary line-clamp-2">
          {desc}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium text-sm">{members}</span>
          <span className="font-semibold">{price}</span>
        </div>
      </CardContent>

      <CardFooter className="px-0 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8">
            <Image
              src={avatar}
              alt={host}
              width={32}
              height={32}
              className="h-full rounded-[10px] object-cover"
            />
          </div>
          <span className="text-base font-medium">{host}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
