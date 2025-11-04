'use client';

import Image from 'next/image';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from 'src/components/ui/dialog';

type FailureModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
};

export const FailureModal: React.FC<FailureModalProps> = ({
  open,
  setOpen,
  onOpenChange,
  title = 'Payment Failed',
  message = 'Your payment could not be processed. Please try again or contact support if the issue persists.',
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogContent
        className="p-8 gap-0 rounded-[30px] w-[450px] text-center"
        showCloseButton={false}
      >
        <Image
          src="/cancelModal.svg"
          alt="failure icon"
          width={88}
          height={88}
          className="mx-auto"
        />
        <DialogTitle className="mt-5 text-[30px] font-semibold text-black">
          {title}
        </DialogTitle>
        <p className="mt-4 text-sm font-medium text-[#787878]">{message}</p>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={() => setOpen(false)}
            className="px-6 h-10 text-sm rounded-2xl border border-[#ECECEC] text-black font-medium bg-white hover:bg-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              setOpen(false);
              // Optionally trigger retry logic here
            }}
            className="px-6 h-10 text-sm rounded-2xl border border-[#0A5DBC] bg-[#0A5DBC] text-white font-medium hover:bg-[#053875] transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
