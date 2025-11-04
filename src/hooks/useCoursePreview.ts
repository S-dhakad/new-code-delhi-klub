import { useState, useEffect } from 'react';
import { coursesService } from 'src/axios/courses';
import { useCommunityStore } from 'src/store/community.store';
import { Course } from 'src/types/courses.types';
import razorpayApi from 'src/axios/razorpay/razorpayApi';
import {
  RazorpayOptions,
  RazorpaySuccessResponse,
} from 'src/types/razorpay.types';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';

export const useCoursePreview = (courseSlug: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const { community } = useCommunityStore();
  const [course, setCourse] = useState<Course>();
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (!community) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const course = await coursesService.getCourseById(
          community.id,
          courseSlug,
        );
        setCourse(course.data.courses);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Error in getting all courses',
          message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [community, courseSlug]);

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

  // Initialize Razorpay payment for course purchase
  const initializeRazorpayCoursePayment = async () => {
    if (!community?.id || !course?.id) {
      showToast({
        type: 'default-error',
        title: 'Community or course information not found.',
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast({
          type: 'default-error',
          title:
            'Failed to load Razorpay SDK. Please check your internet connection.',
        });
        return;
      }

      // Create order from backend
      const orderResponse = await razorpayApi.createCourseOrder(
        community.id,
        course.id,
      );
      const isPaid = orderResponse?.data?.data?.isPaid;
      if (isPaid === false) {
      }

      // Access order from the nested response structure
      const order = orderResponse?.data?.data?.order;
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

      if (!order || !order.id) {
        showToast({
          type: 'default-error',
          title: 'Failed to create order. Please try again.',
        });
        return;
      }

      // Razorpay options
      const options: RazorpayOptions = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'Klub',
        description: `Course Purchase: ${course.name}`,
        order_id: order.id,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // Verify payment
            const verifyResponse = await razorpayApi.verifyCoursePayment(
              community.id,
              course.id || '',
              {
                razorpayOrderId: response.razorpay_order_id || '',
                razorpaySignature: response.razorpay_signature,
                razorpayPaymentId: response.razorpay_payment_id,
              },
            );

            if (verifyResponse.success) {
              setShowSuccessModal(true);
            } else {
              setShowFailureModal(true);
            }
          } catch (error) {
            const message = getErrorMessage(error);
            showToast({
              type: 'default-error',
              title: 'Payment verification error',
              message,
            });
            setShowFailureModal(true);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: course.user?.firstName + ' ' + course.user?.lastName || '',
          email: '', // Add user email if available
          contact: '', // Add user contact if available
        },
        theme: {
          color: '#0A5DBC', // Your brand color
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Payment initialization error',
        message,
      });
      setShowFailureModal(true);
      setIsProcessingPayment(false);
    }
  };

  return {
    loading,
    isProcessingPayment,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    course,
    initializeRazorpayCoursePayment,
  };
};
