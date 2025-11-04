'use client';

import { useToastStore } from 'src/store/toast.store';
import { SuccessToast } from '../toasts/SuccessToast';
import { ErrorToast } from '../toasts/ErrorToast';
import { DefaultErrorToast } from '../toasts/DefaultErrorToast';
import { DefaultSuccessToast } from '../toasts/DefaultSuccessToast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast } = useToastStore();

  return (
    <>
      {children}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[9999]">
        {toasts.map((t) => {
          if (t.type === 'success') {
            return (
              <SuccessToast
                key={t.id}
                toast={t}
                onClose={() => dismissToast(t.id)}
              />
            );
          }
          if (t.type === 'default-success') {
            return (
              <DefaultSuccessToast
                key={t.id}
                toast={t}
                onClose={() => dismissToast(t.id)}
              />
            );
          }
          if (t.type === 'error') {
            return (
              <ErrorToast
                key={t.id}
                toast={t}
                onClose={() => dismissToast(t.id)}
              />
            );
          }
          if (t.type === 'default-error') {
            return (
              <DefaultErrorToast
                key={t.id}
                toast={t}
                onClose={() => dismissToast(t.id)}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
