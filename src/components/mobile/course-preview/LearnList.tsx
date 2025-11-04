import React from 'react';
import Image from 'next/image';

export type LearnListProps = {
  items: string[];
};

export default function LearnList({ items }: LearnListProps) {
  return (
    <ul className="flex flex-col gap-4 p-5 bg-white rounded-[20px]">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <Image src="/Check.svg" alt="check icon" width={18} height={18} />
          <span className="text-sm font-semibold">{item}</span>
        </li>
      ))}
    </ul>
  );
}
