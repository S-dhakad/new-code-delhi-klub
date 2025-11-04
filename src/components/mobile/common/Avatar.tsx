import React from 'react';
import Image from 'next/image';

export type AvatarProps = {
  src: string;
  alt?: string;
  /** Total square size (outer), in px */
  size?: number; // default 89 (as per current design)
  /** Padding inside the bordered box, in px */
  padding?: number; // default 8 (p-2)
  /** Additional classes for the outer wrapper */
  className?: string;
  /** Additional classes for the inner image */
  imageClassName?: string;
};

/**
 * Reusable avatar tile with border and padding.
 * Keeps the same visual as the previous inline markup.
 */
export default function Avatar({
  src,
  alt = 'Avatar',
  size = 89,
  padding = 8,
  className = '',
  imageClassName = '',
}: AvatarProps) {
  // Outer box has a solid border and padding, with rounded corners.
  // We rely on inline style for exact px sizing so it can be reused at different sizes.
  const outerStyle: React.CSSProperties = {
    width: size,
    height: size,
    padding,
  };

  return (
    <div
      className={`border-2 border-primary rounded-2xl bg-white ${className}`}
      style={outerStyle}
    >
      {src && typeof src === 'string' && src.trim() !== '' ? (
        <Image
          src={src}
          alt={alt}
          width={size - padding * 2 - 4}
          height={size - padding * 2 - 4}
          className={`object-cover w-full h-full rounded-[12px] ${imageClassName}`}
        />
      ) : (
        <div
          className={`w-full h-full rounded-[12px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center ${imageClassName}`}
        >
          <span className="text-white text-sm font-semibold">
            {alt?.charAt(0) || 'U'}
          </span>
        </div>
      )}
    </div>
  );
}
