'use client';

import React from 'react';
import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from 'src/components/ui/dialog';
import { Input } from '../ui/input';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTopicsModal({ isOpen, onClose }: Props) {
  const [value, setValue] = React.useState('');
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="mb-3 text-[#787878]">
          <DialogTitle>Add a Topic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full">
            <label
              htmlFor="space-name"
              className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-500"
            >
              Name
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 pl-5 py-1">
              <Image src="/hashtag.svg" alt="hash" width={18} height={18} />
              <Input
                id="space-name"
                value={value}
                onChange={(e) => e.target.value}
                placeholder="Automation Tools"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 border-0 p-0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full bg-primary text-white rounded-2xl hover:bg-blue-600 h-11">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
