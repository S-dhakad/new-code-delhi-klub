import { useState } from 'react';
import razorpayApi from 'src/axios/razorpay/razorpayApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';

export function useRezorPayEmailcheck() {
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const showToast = useToastStore((s) => s.showToast);

  // Exposed function that accepts an email string and checks it.
  const checkEmail = async (email?: string) => {
    if (!email) {
      setEmailExists(false);
      return { exists: false };
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await razorpayApi.checkRezorPayemail(email);
      const exists = response?.data?.exists ?? false;
      setEmailExists(exists);
      return response.data;
    } catch (err) {
      setError(err);
      showToast({
        type: 'default-error',
        title: 'Invalid email formated',
        message:
          getErrorMessage(err) || 'An error occurred while checking email.',
      });
      return { exists: false };
    } finally {
      setIsChecking(false);
    }
  };

  const updateEmail = async (communityId: string, email: string) => {
    if (!email) {
      showToast({
        type: 'default-error',
        title: 'Invalid email formated',
        message: 'Email is required',
      });
      return;
    }
    try {
      const response = await razorpayApi.updateRezorPayemail(
        communityId,
        email,
      );
      return response.data;
    } catch (err) {
      return { exists: false };
    } finally {
    }
  };

  return { emailExists, isChecking, error, checkEmail, updateEmail };
}
