'use client';

import Image from 'next/image';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from 'src/components/ui/dialog';
import { Button } from '../ui/button';

type TagFailureModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  subTitle?: string;
};

export const TagFailureModal: React.FC<TagFailureModalProps> = ({
  open,
  setOpen,
  onOpenChange,
  title,
  message,
  subTitle,
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
        <p className="text-[#DE0000] text-base font-medium mt-4">{subTitle}</p>
        <p className="mt-4 text-sm font-medium text-[#787878]">{message}</p>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3 justify-center">
          <Button
            onClick={() => setOpen(false)}
            className="px-6 h-10 text-sm rounded-2xl border border-[#ECECEC] text-black font-medium bg-white hover:bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              // Optionally trigger retry logic here
            }}
            className="px-6 h-10 text-sm rounded-2xl border border-[#DE0000] bg-[#DE0000] text-white font-medium hover:bg-[#DE0000]"
          >
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
