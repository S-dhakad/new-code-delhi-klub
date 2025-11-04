'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Auth from 'src/components/mobile/common/Auth';
import GoogleOAuthCallback from 'src/components/signup/GoogleOAuthPage';
import { useAuthStore } from 'src/store/auth.store';

interface GoogleOAuthResponse {
  data: {
    accessToken: string;
  };
}

function CreatorSignupSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function CreatorSignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();
  const hasOAuthCode = searchParams.get('code');

  const handleOAuthSuccess = (response: GoogleOAuthResponse) => {
    const token = response.data?.accessToken;

    if (token) {
      login(token);

      // Redirect to creator profile or dashboard
      router.push('/mobile/creator-profile');
    } else {
      console.error('No access token found in response.data.accessToken');
    }
  };

  const handleOAuthError = (error: string) => {
    console.error('OAuth error:', error);
  };

  if (hasOAuthCode) {
    return (
      <GoogleOAuthCallback
        onSuccess={handleOAuthSuccess}
        onError={handleOAuthError}
      />
    );
  }

  return <Auth type="creator" />;
}

const CreatorSignupPage = () => {
  return (
    <Suspense fallback={<CreatorSignupSpinner />}>
      <CreatorSignupContent />
    </Suspense>
  );
};

export default CreatorSignupPage;
