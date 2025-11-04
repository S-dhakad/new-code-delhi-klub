import React from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';
import { Event } from 'src/types/events.types';
import { useEventActions } from 'src/hooks/useEventActions';

type Props = {
  event: Event;
  onClose?: () => void;
  onSuccess?: () => void;
};

/**
 * Mobile Cancel Event Component
 * Full-screen modal for canceling events
 * Uses custom hook for event actions
 */
const CancelEvent: React.FC<Props> = ({ event, onClose, onSuccess }) => {
  // Use custom hook for event actions
  const { cancelEvent, isCancelling } = useEventActions(() => {
    onClose?.();
    onSuccess?.();
  });

  /**
   * Handle cancel confirmation
   */
  const handleCancel = async () => {
    if (!event?.id) return;
    await cancelEvent(event.id);
  };
  return (
    <div className="mx-auto max-w-[410px] flex flex-col items-center justify-center gap-5 px-7 py-10 bg-white border rounded-[30px]">
      <Image src="/cancelModal.svg" alt="Cancel Event" width={88} height={88} />
      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-3xl font-semibold">Cancel Event</h2>
        <h4 className="text-base font-medium text-[#DE0000]">
          This action cannot be undone
        </h4>
        <p className="text-sm font-medium text-text-secondary">
          Canceling this event will notify all participants by email and remove
          it from their calendars
        </p>
      </div>

      {/* Button width needs to be changed */}
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          size="lg"
          className="w-[155px]"
          onClick={onClose}
          disabled={isCancelling}
        >
          Do not cancel
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="w-[155px]"
          onClick={handleCancel}
          disabled={isCancelling}
        >
          {isCancelling ? 'Canceling...' : 'Yes, Cancel'}
        </Button>
      </div>
    </div>
  );
};

export default CancelEvent;
