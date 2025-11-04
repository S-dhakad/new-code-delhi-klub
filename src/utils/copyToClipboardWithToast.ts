// src/utils/copyToClipboardWithToast.ts
import { useToastStore } from 'src/store/toast.store';

export const copyToClipboardWithToast = (path: string) => {
  if (typeof window === 'undefined') return;

  const url = path.startsWith('http')
    ? path
    : `${window.location.origin}${path}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      const showToast = useToastStore.getState().showToast;
      showToast({
        type: 'default-success',
        title: 'Link copied to clipboard!',
        message: url,
      });
    })
    .catch((error) => {
      console.error('Failed to copy link:', error);
      const showToast = useToastStore.getState().showToast;
      showToast({
        type: 'default-error',
        title: 'Failed to copy link',
        message: 'Please try again.',
      });
    });
};
