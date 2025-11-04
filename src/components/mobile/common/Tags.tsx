import React from 'react';

export type TagsProps = {
  items?: string[];
  className?: string; // container classes
  pillClassName?: string; // individual tag classes
  showIfEmpty?: boolean;
};

export default function Tags({
  items,
  className,
  pillClassName,
  showIfEmpty = false,
}: TagsProps) {
  const list = items ?? [];
  if (!showIfEmpty && list.length === 0) return null;

  return (
    <div className={'flex flex-wrap gap-2 ' + (className ?? '')}>
      {list.map((tag, idx) => (
        <span
          key={idx}
          className={
            'inline-flex items-center rounded-[10px] bg-[#E6EFF8] px-2.5 py-1 text-xs font-medium ' +
            (pillClassName ?? '')
          }
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
