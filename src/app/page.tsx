'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DiscoveryPage from './discovery/page';
import { MobileDiscoveryPage } from 'src/mobile-pages';
import GoogleOAuthCallback from 'src/components/signup/GoogleOAuthPage';
import { useIsMobile } from 'src/hooks/useIsMobile';

// Loading component for Suspense fallback
function HomePageSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Internal component that uses useSearchParams
function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasOAuthCode = searchParams.get('code');
  const isMobile = useIsMobile();

  const handleOAuthSuccess = (response: { data: { accessToken: string } }) => {
    // Store the authentication data
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    // Redirect to appropriate page after successful authentication
    // You can redirect to dashboard, profile setup, or wherever makes sense
    router.push('/discovery'); // or '/dashboard' or '/profile'
  };

  const handleOAuthError = (error: string) => {
    console.error('OAuth error on home page:', error);

    // Redirect back to login page on error
    router.push('/login?error=oauth_failed');
  };

  // If we have an OAuth code, handle the callback
  if (hasOAuthCode) {
    return (
      <GoogleOAuthCallback
        onSuccess={handleOAuthSuccess}
        onError={handleOAuthError}
      />
    );
  }

  // Render mobile or desktop view based on device type
  if (isMobile) {
    return <MobileDiscoveryPage />;
  }

  // Otherwise, render the desktop discovery page
  return <DiscoveryPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageSpinner />}>
      <HomePageContent />
    </Suspense>
  );
}
