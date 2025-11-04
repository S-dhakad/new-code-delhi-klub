export interface RazorpayVerifyCommunityPaymentInput {
  razorpaySubscriptionId: string;
  razorpaySignature: string;
  razorpayPaymentId: string;
  planId: string;
}

export interface RazorpayVerifyCoursePaymentInput {
  razorpayOrderId: string;
  razorpaySignature: string;
  razorpayPaymentId: string;
}

export interface RazorpayVerifyCreateCommunityPaymentInput {
  razorpaySubscriptionId: string;
  razorpaySignature: string;
  razorpayPaymentId: string;
  planId: string;
  razorpayID: string;
}

export interface CreateRazorpayAccountInput {
  accountName: string;
  accountEmail: string;
  businessName: string;
  businessType: string;
  bankIFSCCode: string;
  accountNumber: string;
  reEnterAccountNumber: string;
  beneficiaryName: string;
  phoneNumber?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  subscription_id?: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: {
    description: string;
    code: string;
    reason: string;
  };
}

export interface RazorpayInstance {
  open(): void;
  on(
    event: 'payment.failed',
    handler: (response: RazorpayFailureResponse) => void,
  ): void;
}
