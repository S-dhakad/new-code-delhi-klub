import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'src/store/auth.store';
import { useProfileStore } from 'src/store/profile.store';
import { useCreatorRazorpayStore } from 'src/store/creator-subscriber-razorpay.store';
import { useToastStore } from 'src/store/toast.store';
import razorpayApi from 'src/axios/razorpay/razorpayApi';
import type {
  RazorpayOptions,
  RazorpaySuccessResponse,
} from 'src/types/razorpay.types';

export const useCreateCommunity = () => {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const { profile } = useProfileStore();
  const { initalizeRazorpay, setInitalizeRazorpay } = useCreatorRazorpayStore();
  const { showToast } = useToastStore();

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = useCallback(async () => {
    try {
      setLoading(true);
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast({
          title:
            'Failed to load Razorpay SDK. Please check your internet connection.',
          type: 'default-error',
        });
        return;
      }

      // Create order from backend
      const orderResponse = await razorpayApi.createCommunityOrder();

      if (!orderResponse || !orderResponse.data?.data?.subscription) {
        showToast({
          title: 'Failed to create subscription. Please try again.',
          type: 'default-error',
        });
        return;
      }

      const subscription = orderResponse.data.data.subscription;
      const key =
        orderResponse.data.data.key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        '';

      // Razorpay options
      const options: RazorpayOptions = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: subscription.amount || 0,
        currency: 'INR',
        name: 'Klub',
        description: 'Community Creation Subscription',
        subscription_id: subscription.id,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // Verify payment
            const verifyResponse = await razorpayApi.verifyCreateCommunityOrder(
              {
                razorpaySubscriptionId: response.razorpay_subscription_id || '',
                razorpaySignature: response.razorpay_signature,
                razorpayPaymentId: response.razorpay_payment_id,
                planId: subscription.plan_id || '',
                razorpayID:
                  subscription.notes?.razorpayID || 'acc_RN6F3kvaI0Qzw6',
              },
            );

            if (verifyResponse.success) {
              // Get community ID from the response
              const createdCommunityId =
                verifyResponse.data?.data?.community?.data?.community?.id;
              if (createdCommunityId) {
                setShowSuccessModal(true);
                // Redirect to razorpay setup form with communityId
                setTimeout(() => {
                  router.push(
                    `/razorpay-setup?communityId=${createdCommunityId}`,
                  );
                }, 2000);
              }
            } else {
              setShowFailureModal(true);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setShowFailureModal(true);
          } finally {
            // Restore body scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            setInitalizeRazorpay(false);
            setLoading(false);
          }
        },
        prefill: {
          name: profile?.firstName + ' ' + profile?.lastName || '',
          email: profile?.email || '',
          contact: '',
        },
        theme: {
          color: '#0A5DBC',
        },
        modal: {
          ondismiss: function () {
            // Restore body scroll when modal is dismissed
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            setInitalizeRazorpay(false);
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      setShowFailureModal(true);
      // Restore body scroll on error
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setInitalizeRazorpay(false);
    } finally {
      setLoading(false);
    }
  }, [setInitalizeRazorpay, profile, showToast, router]);

  // Handle Create Community button click
  const handleCreateCommunity = async () => {
    if (!accessToken) {
      showToast({
        title: 'Authentication Required',
        message: 'Please login to create a community.',
        type: 'default-error',
      });
      router.push('/login');
      return;
    }

    await initializeRazorpayPayment();
  };

  // Auto-trigger payment modal if initalizeRazorpay is true
  useEffect(() => {
    if (initalizeRazorpay) {
      initializeRazorpayPayment();
    }
  }, [initalizeRazorpay, initializeRazorpayPayment]);

  return {
    loading,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    handleCreateCommunity,
  };
};
