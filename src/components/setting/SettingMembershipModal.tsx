'use client';

import Image from 'next/image';
import * as React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from 'src/components/ui/dialog';
import { Button } from '../ui/button';

type SettingMembershipModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SettingMembershipModal: React.FC<SettingMembershipModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-[30px] gap-0 rounded-[20px] overflow-hidden w-full"
        style={{ maxWidth: '647px' }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Membership Settings</DialogTitle>
        <div className="flex items-center justify-between px-0 py-0 border-b border-[#ECECEC] bg-white pb-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-[15px] overflow-hidden flex-shrink-0">
              <Image
                src="/badge1.jpg"
                alt="community avatar"
                width={44}
                height={44}
                className="object-cover w-11 h-11"
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-[#000000]">
                Zero to Founder
              </div>
              <div className="text-sm font-medium text-[#787878] mt-[2px]">
                102K members | Free
              </div>
            </div>
          </div>

          {/* Close button */}
          <DialogClose asChild>
            <button
              className="rounded-full focus:outline-none p-0"
              aria-label="Close"
            >
              <Image src="/plus.svg" alt="plus icon" width={32} height={32} />
            </button>
          </DialogClose>
        </div>

        <div className="flex bg-white pt-5">
          <div className="w-[180px] border-r border-[#ECECEC] pr-[20px]">
            <div
              className="flex items-center justify-start gap-2 w-full rounded-[10px] bg-[#F6F6F6] px-3 py-2 text-sm font-medium text-[#000000]"
              aria-current="true"
            >
              <div className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center flex-shrink-0">
                <Image src="/shop.svg" alt="plus icon" width={16} height={16} />
              </div>
              Membership
            </div>
          </div>

          {/* Right column (content) */}
          <div className="flex-1 pl-5 pt-[10px]">
            <div className="text-base font-medium text-[#000000] mb-2">
              Membership
            </div>
            <div className="text-sm font-medium text-[#787878]">
              You have been a member of this community since
              <span className="text-sm font-semibold text-[#111827]">
                August 10th, 2025
              </span>
            </div>

            <div>
              <Button
                className="bg-[#DE0000] hover:bg-[#DE0000] text-white rounded-[10px] px-5 py-2  mt-5 h-10"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Exit Community
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
