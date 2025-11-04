import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

export type ToastType =
  | 'success'
  | 'default-success'
  | 'error'
  | 'default-error';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message?: string;
  duration: number;
  createdAt: number;
}

type ToastState = {
  toasts: Toast[];
  showToast: (t: {
    title?: string;
    message?: string;
    type?: ToastType;
    duration?: number;
  }) => void;
  dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: ({ title, message, type = 'success', duration = 4000 }) => {
    const toast: Toast = {
      id: uuid(),
      title,
      message,
      type,
      duration,
      createdAt: Date.now(),
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== toast.id) }));
    }, duration);
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
