'use client';

import React, { useState, useEffect } from 'react';
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
  onSave: (point: string) => void;
};

export default function AddPointsModal({ isOpen, onClose, onSave }: Props) {
  const [pointText, setPointText] = useState('');

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPointText('');
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmedPoint = pointText.trim();
    if (trimmedPoint) {
      onSave(trimmedPoint);
      setPointText('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader className="mb-3 text-[#787878]">
          <DialogTitle>Add a Point</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* pill-style input with floating label */}
          <div className="relative w-full">
            <label
              htmlFor="space-name"
              className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-500"
            >
              Add Points
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 pl-5 py-1">
              <Input
                id="space-name"
                placeholder="eg:-write points"
                value={pointText}
                onChange={(e) => setPointText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 border-0 p-0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!pointText.trim()}
            className="w-full bg-primary text-white rounded-2xl hover:bg-blue-600 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
