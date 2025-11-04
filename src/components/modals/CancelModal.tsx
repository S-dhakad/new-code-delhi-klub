'use client';

import Image from 'next/image';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from 'src/components/ui/dialog';
import { Event } from 'src/types/events.types';
import { Button } from '../ui/button';
import { useEventActions } from 'src/hooks/useEventActions';

type CancelModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  event: Event | null;
  onSuccess?: () => void;
};

/**
 * Cancel Event Modal Component
 * Confirms and executes event cancellation
 * Uses custom hook for event actions
 */
export const CancelModal: React.FC<CancelModalProps> = ({
  open,
  setOpen,
  onOpenChange,
  event,
  onSuccess,
}) => {
  // Use custom hook for event actions
  const { cancelEvent, isCancelling } = useEventActions(() => {
    setOpen(false);
    onSuccess?.();
  });

  /**
   * Handle cancel event button click
   */
  const handleCancelEvent = async () => {
    if (!event?.id) return;
    await cancelEvent(event.id);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogContent
        className="p-8 gap-0 rounded-[30px] w-[450px] text-center"
        showCloseButton={false}
      >
        <Image
          src="/cancelModal.svg"
          alt="cancel icon"
          width={88}
          height={88}
          className="mx-auto"
        />
        <DialogTitle className='mt-5 text-[30px] font-semibold text-black"'>
          Are you sure?
        </DialogTitle>
        <p className="mt-4 text-base font-medium text-[#DE0000]">
          This action cannot be undone
        </p>
        <p className="mt-4 text-sm font-medium text-[#787878]">
          Canceling this event will notify all participants by email and remove
          it from their calendars
        </p>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3 justify-center">
          <Button
            disabled={isCancelling}
            onClick={() => setOpen(false)}
            className={`px-6 h-10 text-sm rounded-2xl border border-[#ECECEC] font-medium ${
              isCancelling
                ? 'bg-[#F8F8F8] text-[#B0B0B0] cursor-not-allowed'
                : 'bg-white text-black hover:bg-white'
            }`}
          >
            Do not cancel
          </Button>
          <Button
            onClick={handleCancelEvent}
            disabled={isCancelling}
            className={`px-6 h-10 text-sm rounded-2xl border border-[#DE0000] text-white font-medium ${
              isCancelling
                ? 'bg-[#F3C8C8] cursor-not-allowed'
                : 'bg-[#DE0000] hover:bg-[#DE0000]'
            }`}
          >
            {isCancelling ? 'Canceling...' : 'Yes, Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
