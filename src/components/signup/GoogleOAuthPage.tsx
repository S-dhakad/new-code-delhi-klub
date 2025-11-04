import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from 'src/axios/auth/authApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';

interface GoogleOAuthCallbackProps {
  onSuccess?: (response: {
    data: { accessToken: string; isNewUser?: boolean };
  }) => void;
  onError?: (error: string) => void;
}

// Loading component for internal use
function ProcessingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing...</p>
      </div>
    </div>
  );
}

// Internal component that uses useSearchParams
const GoogleOAuthCallbackInternal: React.FC<GoogleOAuthCallbackProps> = ({
  onSuccess,
  onError,
}) => {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useToastStore((s) => s.showToast);

  const fetchUserInfo = useCallback(
    async (code: string) => {
      if (!code) {
        const errorMessage = 'No authentication code found!';
        showToast({
          type: 'default-error',
          title: errorMessage,
        });
        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Prevent multiple calls
      if (hasProcessed || isProcessing) {
        showToast({
          type: 'default-error',
          title: 'OAuth callback already processed or in progress',
        });
        return;
      }

      setIsProcessing(true);
      setHasProcessed(true);

      try {
        const response = await authService.googleOAuthCallback({ code });
        if (response.success || response.accessToken) {
          // Handle successful authentication
          onSuccess?.(response);

          // Clear the URL parameters after processing
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );

          // Don't redirect here - let the parent component handle navigation
          // router.push('/');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        const errorMessage = 'Failed to login with Google. Please try again.';
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: errorMessage,
          message,
        });
        setError(errorMessage);
        onError?.(errorMessage);
        // Reset hasProcessed on error so user can retry
        setHasProcessed(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [hasProcessed, isProcessing, onSuccess, onError, router],
  );

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !hasProcessed && !isProcessing) {
      fetchUserInfo(code);
    }
  }, [searchParams, fetchUserInfo, hasProcessed, isProcessing]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Logging you in with Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
};

// Main component that wraps the internal component with Suspense
const GoogleOAuthCallback: React.FC<GoogleOAuthCallbackProps> = (props) => {
  return (
    <Suspense fallback={<ProcessingSpinner />}>
      <GoogleOAuthCallbackInternal {...props} />
    </Suspense>
  );
};

export default GoogleOAuthCallback;
