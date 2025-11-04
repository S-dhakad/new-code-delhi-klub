import React from 'react';
import Image from 'next/image';

export type CoursePreviewHeroProps = {
  imageSrc: string;
  ratingText?: string; // e.g. "5/5"
};

export default function CoursePreviewHero({
  imageSrc,
  ratingText = '5/5',
}: CoursePreviewHeroProps) {
  return (
    <div className="relative w-full h-[170px] rounded-[20px] overflow-hidden">
      <Image
        src={imageSrc}
        alt="course thumbnail"
        fill
        className="object-cover"
      />

      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/60 backdrop-blur-3xl text-sm px-2 py-1 rounded-xl font-medium">
        <Image src="/play.svg" alt="Play" width={16} height={16} />
        Preview
      </div>
    </div>
  );
}
