'use client';
import React, { useState } from 'react';
import { CancelModal } from 'src/components/modals/CancelModal';
import { SucessModal } from 'src/components/modals/SucessModal';
import { useToastStore } from 'src/store/toast.store';

const StaticPage = () => {
  const [canceModalOpen, setCancelModalOpen] = useState(false);
  const [sucessModalOpen, setSucessModalOpen] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  return (
    <div className="flex gap-4 p-10">
      <button
        className="border border-gray-600 p-3"
        onClick={() => setCancelModalOpen(true)}
      >
        Click to open Cancel modal
      </button>
      <button
        className="border border-red-600 p-3"
        onClick={() => setSucessModalOpen(true)}
      >
        Click to open sucess modal
      </button>
      <button
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Changes Saved',
            message: 'All your changes have been successfully saved',
            duration: 5000,
          })
        }
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Success Full
      </button>

      <button
        onClick={() =>
          showToast({ type: 'success', title: 'Changes Saved', duration: 5000 })
        }
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Success
      </button>

      <button
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Unsaved Changes!',
            message: 'Oops!! You forgot to save your changes.',
            duration: 5000,
          })
        }
        className="border px-3 py-1 bg-red-600 text-white rounded"
      >
        Error Full
      </button>
      <button
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Unsaved Changes!',
            duration: 5000,
          })
        }
        className="border px-3 py-1 bg-red-600 text-white rounded"
      >
        Error
      </button>

      <CancelModal
        open={canceModalOpen}
        setOpen={setCancelModalOpen}
        onOpenChange={setCancelModalOpen}
        event={null}
      />

      <SucessModal
        open={sucessModalOpen}
        setOpen={setSucessModalOpen}
        onOpenChange={setSucessModalOpen}
      />
    </div>
  );
};

export default StaticPage;
