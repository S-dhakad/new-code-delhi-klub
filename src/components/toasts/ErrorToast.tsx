'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Toast } from 'src/store/toast.store';

export function ErrorToast({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const [remaining, setRemaining] = useState(toast.duration / 1000);

  useEffect(() => {
    if (remaining <= 0) {
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining, onClose]);

  return (
    <div className="w-[380px] rounded-[20px] border border-[#ECECEC] overflow-hidden animate-fadeIn">
      <div className="p-4 bg-white">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/toast-cancel.svg"
              alt="error icon"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <p className="text-base font-semibold text-black">{toast.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 ml-2">
            <Image
              src="/Plus.svg"
              alt="close icon"
              width={32}
              height={32}
              className="w-full h-full rotate-45" // optional if plus is used as close
            />
          </button>
        </div>
        {toast.message && (
          <div className="pl-11 pr-5">
            <p className="text-sm text-gray-600 font-medium mt-1">
              {toast.message} <span className="text-black">Save them now</span>
            </p>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 font-medium py-3 px-4 bg-[#F6F6F6]">
        This message will close in{' '}
        <span className="text-black">{remaining} seconds</span>
      </p>
    </div>
  );
}
