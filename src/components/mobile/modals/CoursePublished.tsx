import React from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';

type Props = { onClose?: () => void };

const CancelEvent: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="mx-auto max-w-[410px] flex flex-col items-center justify-center gap-5 px-7 py-10 bg-white border rounded-[30px]">
      <Image
        src="/coursePublished.png"
        alt="Cancel Event"
        width={88}
        height={88}
      />
      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-3xl font-semibold">Course Published</h2>
        <p className="text-sm font-medium text-text-secondary text-center">
          Everyone inside your community will now be able to purchase and start
          this course
        </p>
      </div>

      <p className="text-xs font-medium text-text-secondary">
        This message will close in <span className="text-black">5 seconds</span>
      </p>
    </div>
  );
};

export default CancelEvent;
