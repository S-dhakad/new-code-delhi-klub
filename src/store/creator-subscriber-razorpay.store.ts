import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreatorRazorpayStore {
  initalizeRazorpay: boolean;
  setInitalizeRazorpay: (initalizeRazorpay: boolean) => void;
}

interface SubscriberRazorpayStore {
  initalizeRazorpay: boolean;
  setInitalizeRazorpay: (initalizeRazorpay: boolean) => void;
  communityId: string;
  setCommunityIdForSubscriberStore: (communityId: string) => void;
}

export const useCreatorRazorpayStore = create<CreatorRazorpayStore>()(
  persist(
    (set) => ({
      initalizeRazorpay: false,
      setInitalizeRazorpay: (initalizeRazorpay) => set({ initalizeRazorpay }),
    }),
    {
      name: 'creator-razorpay-storage',
    },
  ),
);

export const useSubscriberRazorpayStore = create<SubscriberRazorpayStore>()(
  persist(
    (set) => ({
      initalizeRazorpay: false,
      setInitalizeRazorpay: (initalizeRazorpay) => set({ initalizeRazorpay }),
      communityId: '',
      setCommunityIdForSubscriberStore: (communityId) => set({ communityId }),
    }),
    {
      name: 'subscriber-razorpay-storage',
    },
  ),
);
