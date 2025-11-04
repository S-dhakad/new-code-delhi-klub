'use client';

import Image from 'next/image';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from 'src/components/ui/dialog';

type SucessModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  redirectMessage?: string;
  autoClose?: boolean;
  countdown?: number;
};

export const SucessModal: React.FC<SucessModalProps> = ({
  open,
  setOpen,
  onOpenChange,
  title = 'Payment Successful',
  message = 'Thank you for your purchase!',
  redirectMessage = "You'll be redirected in",
  autoClose = true,
  countdown = 5,
}) => {
  const [counter, setCounter] = React.useState(countdown);
  const intervalRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!open) {
      setCounter(countdown);
      return;
    }
    setCounter(countdown);

    if (autoClose) {
      intervalRef.current = window.setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open, autoClose, countdown]);
  React.useEffect(() => {
    if (!autoClose || counter > 0) return;

    // clear interval if any
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const t = window.setTimeout(() => {
      if (typeof onOpenChange === 'function') {
        try {
          onOpenChange(false);
        } catch {
          setOpen(false);
        }
      } else {
        setOpen(false);
      }
    }, 0);

    return () => clearTimeout(t);
  }, [counter, onOpenChange, setOpen, autoClose]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogContent
        className="p-8 gap-0 rounded-[30px] w-[450px] text-center"
        showCloseButton={false}
      >
        <Image
          src="/sucessModal.svg"
          alt="success icon"
          width={88}
          height={88}
          className="mx-auto"
        />
        <DialogTitle className="mt-5 text-[30px] font-semibold text-black">
          {title}
        </DialogTitle>
        <p className="mt-4 text-sm font-medium text-[#787878]">
          {message}
          {autoClose && (
            <>
              <br />
              {redirectMessage} <span>{Math.max(0, counter)}</span> second
              {counter !== 1 && 's'}.
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};
