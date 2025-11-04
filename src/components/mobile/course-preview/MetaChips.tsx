import React from 'react';
import Image from 'next/image';

export type MetaChip = { label: string; value: string; imageSrc: string };
export type MetaChipsProps = {
  items: MetaChip[];
};

export default function MetaChips({ items }: MetaChipsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl bg-white px-5 py-2.5"
        >
          <Image
            src={it.imageSrc}
            alt={it.label}
            width={18}
            height={18}
            className="text-primary"
          />
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-medium text-text-secondary">
              {it.label}
            </div>
            <div className="text-sm font-semibold">{it.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
