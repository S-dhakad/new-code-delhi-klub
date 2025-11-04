import React from 'react';
import Image from 'next/image';
import Tags from './Tags';

export type CourseCardDetailedProps = {
  imageSrc: string;
  title: string;
  startedAt?: Date | string; // accepts Date or preformatted string
  startedText?: string; // if provided, used directly e.g. "Started June, 13th, 2024"
  price?: number | string; // e.g. 20 or "$20"
  currencySymbol?: string; // defaults to "$" when price is a number
  ratingScore?: number; // e.g. 5
  ratingMax?: number; // e.g. 5
  description?: string;
  tags?: string[];
  // Optional progress to support "My Courses" usage
  progressPercent?: number; // 0-100
  progressTrackClassName?: string;
  progressBarClassName?: string;
};

function formatWithOrdinal(day: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  return day + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatStarted(startedAt?: Date | string): string | undefined {
  if (!startedAt) return undefined;
  if (typeof startedAt === 'string') return startedAt; // assume preformatted
  try {
    const d = new Date(startedAt);
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = formatWithOrdinal(d.getDate());
    const year = d.getFullYear();
    return `Started ${month}, ${day}, ${year}`;
  } catch {
    return undefined;
  }
}

function formatPrice(
  price?: number | string,
  currencySymbol = '$',
): string | undefined {
  if (price === undefined || price === null) return undefined;
  if (typeof price === 'string') return price;
  return `${currencySymbol}${price}`;
}

export default function CourseCardDetailed({
  imageSrc,
  title,
  startedAt,
  startedText,
  price,
  currencySymbol = '$',
  ratingScore,
  ratingMax = 5,
  description,
  tags,
  progressPercent,
  progressTrackClassName,
  progressBarClassName,
}: CourseCardDetailedProps) {
  const started = startedText ?? formatStarted(startedAt);
  const priceText = formatPrice(price, currencySymbol);
  const clampedProgress =
    typeof progressPercent === 'number'
      ? Math.max(0, Math.min(100, Math.round(progressPercent)))
      : undefined;

  return (
    <div className="rounded-[20px] py-5 px-4 bg-white overflow-hidden">
      <div className="relative w-full h-[190px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover rounded-[20px]"
        />
        {typeof ratingScore === 'number' && (
          <div className="absolute bottom-5 right-5 inline-flex items-center gap-1 rounded-[10px] bg-white/90 backdrop-blur px-2 py-1.5 text-xs font-medium">
            {/* Star icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FFC107"
              className="w-4 h-4"
              aria-hidden
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>
              {ratingScore}/{ratingMax}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex flex-col gap-1">
          <div className="font-semibold leading-5">{title}</div>
          {started && !clampedProgress && (
            <div className="text-xs font-medium text-text-secondary">
              {started}
            </div>
          )}

          {priceText && !clampedProgress && (
            <div className="text-[18px] font-semibold">{priceText}</div>
          )}

          {typeof clampedProgress === 'number' && (
            <div className="">
              <div className="text-xs font-medium text-text-secondary">
                Progress: <span className="text-black">{clampedProgress}%</span>
              </div>
              <div
                className={`mt-1.5 h-3 w-full rounded-full bg-[#E6E6E6] ${progressTrackClassName ?? ''}`}
              >
                <div
                  className={`h-3 rounded-full bg-[#13B184] ${progressBarClassName ?? ''}`}
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>
            </div>
          )}

          {description ? (
            <p className="text-sm font-medium text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>

        {/* Tags / Chips container */}
        <div className="mt-4">
          <Tags items={tags} />
        </div>
      </div>
    </div>
  );
}
