'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import GoogleOAuthCallback from 'src/components/signup/GoogleOAuthPage';
import { useAuthStore } from 'src/store/auth.store';
import {
  useCreatorRazorpayStore,
  useSubscriberRazorpayStore,
} from 'src/store/creator-subscriber-razorpay.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

interface GoogleOAuthResponse {
  data: {
    accessToken: string;
    isNewUser?: boolean;
  };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const { login } = useAuthStore();
  const { initalizeRazorpay: initalizeRazorpayCreator } =
    useCreatorRazorpayStore();
  const {
    initalizeRazorpay: initalizeRazorpaySubscriber,
    communityId: communityIdFromSubscriberStore,
  } = useSubscriberRazorpayStore();

  const handleOAuthSuccess = async (response: GoogleOAuthResponse) => {
    try {
      // Get accessToken and isNewUser from response.data
      const token = response.data?.accessToken;
      const isNewUser = response.data?.isNewUser;

      login(token);

      if (isNewUser) {
        window.location.href = '/edit-profile';
        return;
      }

      // Redirect to dashboard or desired page after successful authentication
      console.log('initalizeRazorpay is', initalizeRazorpayCreator);
      if (initalizeRazorpayCreator) {
        console.log('initalizeRazorpay is true');
        // Redirect to create-community page where payment modal will be triggered
        window.location.href = '/create-community';
      } else if (initalizeRazorpaySubscriber) {
        console.log('initalizeRazorpay is true');
        // Redirect to klub profile based on device type
        window.location.href = `/klub-profile/${communityIdFromSubscriberStore}`;
      } else {
        // Redirect to home (handles both mobile and desktop)
        window.location.href = '/';
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error in handleOAuthSuccess',
        message,
      });
      router.push('/login?error=auth_processing_failed');
    }
  };

  const handleOAuthError = (error: string) => {
    console.error('OAuth error:', error);

    // Redirect back to login page on error
    router.push('/login?error=oauth_failed');
  };

  return (
    <GoogleOAuthCallback
      onSuccess={handleOAuthSuccess}
      onError={handleOAuthError}
    />
  );
}
