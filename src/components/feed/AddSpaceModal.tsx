'use client';

import React from 'react';
import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from 'src/components/ui/dialog';
import { Input } from '../ui/input';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  loading: boolean;
};

export default function AddSpaceModal({
  isOpen,
  onClose,
  value,
  onChange,
  onSave,
  loading,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-sm w-[373px] rounded-[20px] p-[30px] gap-0"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row justify-between mb-5">
          <DialogTitle className="text-base font-medium text-[#787878]">
            Add a Space
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="rounded-full focus:outline-none p-0"
              aria-label="Close"
            >
              <Image src="/plus.svg" alt="plus icon" width={32} height={32} />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          {/* pill-style input with floating label */}
          <div className="relative w-full">
            <label
              htmlFor="space-name"
              className="absolute -top-2 left-4 bg-white px-2 text-sm font-medium text-[#959494]"
            >
              Name
            </label>
            <div className="flex items-center gap-3 rounded-full border border-[#ECECEC] px-2 pl-5 py-1">
              <Image src="/hashtag.svg" alt="hash" width={18} height={18} />
              <Input
                id="space-name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Automation Tools"
                className="flex-1 bg-transparent text-sm font-medium text-[#000000] outline-none border-0"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={() => {
              if (loading || !value || !value.trim()) return;
              onSave();
            }}
            disabled={loading || !value || !value.trim()}
            aria-disabled={loading || !value || !value.trim()}
            className={`w-full rounded-[15px] text-sm font-medium h-11 ${
              loading || !value || !value.trim()
                ? 'bg-[#BFD8F6] text-white cursor-not-allowed'
                : 'bg-[#0A5DBC] text-white hover:bg-[#0A5DBC]'
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
