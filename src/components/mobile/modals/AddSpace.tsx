'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { X } from 'lucide-react';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  onSave?: () => void;
  loading?: boolean;
  onClose?: () => void;
};

const AddSpace: React.FC<Props> = ({
  value,
  onChange,
  onSave,
  loading,
  onClose,
}) => {
  // fallback local state if not controlled via props
  const [name, setName] = useState<string>(value ?? 'Automation Tools');
  const controlled =
    typeof value === 'string' && typeof onChange === 'function';

  return (
    <div className="w-[373px] rounded-[20px] bg-white shadow-lg p-7 border border-border-stroke-regular">
      {/* Header */}
      <div className="flex items-center justify-between text-text-secondary">
        <h3 className="text-base font-medium">Add a Space</h3>
        <button aria-label="Close" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Floating label input */}
      <div className="mt-5">
        <div className="relative w-full">
          <label
            htmlFor="space-name"
            className="absolute -top-2 left-4 bg-white px-1 text-sm font-medium text-text-secondary"
          >
            Name
          </label>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 pl-5 py-2">
            <Image src="/hashtag.svg" alt="hash" width={18} height={18} />
            <Input
              id="space-name"
              value={controlled ? value : name}
              onChange={(e) =>
                controlled
                  ? onChange?.(e.target.value)
                  : setName(e.target.value)
              }
              placeholder="Automation Tools"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary border-0 p-0"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <Button
          className="w-full bg-primary text-white rounded-2xl hover:bg-primary h-11"
          onClick={() => {
            if (loading) return;
            if (controlled) {
              onSave?.();
            } else {
              // uncontrolled fallback: just close
              onClose?.();
            }
          }}
          disabled={loading || !(controlled ? value?.trim() : name.trim())}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default AddSpace;
