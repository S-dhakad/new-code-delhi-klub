import React from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';

type KlubCardProps = {
  image: string;
  title: string;
  membersText: string; // e.g., "102K members"
  priceText: string; // e.g., "Free" or "$99/m"
  onView?: () => void;
};

const KlubCard: React.FC<KlubCardProps> = ({
  image,
  title,
  membersText,
  priceText,
  onView,
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-[20px] p-5">
      {/* Left: thumbnail + texts */}
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src={image}
          alt={title}
          width={44}
          height={44}
          className="rounded-[10px] object-cover aspect-square"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{title}</div>
          <div className="text-sm font-medium text-text-secondary mt-1 truncate">
            {membersText} | {priceText}
          </div>
        </div>
      </div>

      {/* Right: button */}
      <Button
        onClick={onView}
        variant="primary"
        size="md"
        className="text-sm h-10 px-5 ml-1"
      >
        View
      </Button>
    </div>
  );
};

export default KlubCard;
