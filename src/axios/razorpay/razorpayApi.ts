import axios from '../axios';
import {
  RazorpayVerifyCommunityPaymentInput,
  RazorpayVerifyCoursePaymentInput,
  RazorpayVerifyCreateCommunityPaymentInput,
  CreateRazorpayAccountInput,
} from '../../types/razorpay.types';

const razorpayApi = {
  // Create order to join a specific community
  createJoinCommunityOrder: async (communityId: string) => {
    const response = await axios.private.post(
      `/community/${communityId}/razorpay/create-join-community-order`,
    );

    return response.data;
  },

  // Create order for creating a community (requires razorpayID from the community creation form)
  createCommunityOrder: async () => {
    const response = await axios.private.post(
      `/community/razorpay/create-community-order`,
    );

    return response.data;
  },

  // Create order for course purchase inside a community
  createCourseOrder: async (communityId: string, courseId: string) => {
    const response = await axios.private.post(
      `/community/${communityId}/courses/${courseId}/razorpay/create-course-order`,
    );

    return response.data;
  },

  // Verify payment for creating a community
  verifyCreateCommunityOrder: async (
    paymentData: RazorpayVerifyCreateCommunityPaymentInput,
  ) => {
    const response = await axios.private.post(
      `/community/razorpay/verify-create-community-order`,
      paymentData,
    );

    return response.data;
  },

  // Verify payment for joining a specific community
  verifyCreateJoinCommunityPayment: async (
    communityId: string,
    paymentData: RazorpayVerifyCommunityPaymentInput,
  ) => {
    const response = await axios.private.post(
      `/community/${communityId}/razorpay/verify-create-join-community-payment`,
      paymentData,
    );

    return response.data;
  },

  // Verify payment for purchasing a course
  verifyCoursePayment: async (
    communityId: string,
    courseId: string,
    paymentData: RazorpayVerifyCoursePaymentInput,
  ) => {
    const response = await axios.private.post(
      `/community/${communityId}/courses/${courseId}/razorpay/verify-course-payment`,
      paymentData,
    );

    return response.data;
  },

  // Create Razorpay account for a community
  createRazorpayAccount: async (
    communityId: string,
    accountData: CreateRazorpayAccountInput,
  ) => {
    const response = await axios.private.post(
      `/community/${communityId}/razorpay/accounts/create-razorpay-account`,
      accountData,
    );

    return response.data;
  },

  async checkRezorPayemail(email: string) {
    const response = await axios.private.get(
      `/community/check-razorpay-email?email=${email}`,
    );
    return response.data;
  },

  async updateRezorPayemail(communityId: string, email: string) {
    const response = await axios.private.put(
      `/community/${communityId}/update-razorpay-email`,
      { email: email },
    );
    return response.data;
  },
};

export default razorpayApi;
