export interface PaymentVerificationData {
  paymentId: string; // Our backend ID (from enrollment creation)
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  paidAt?: string;
  method?: string;
  transactionId?: string; // Bank/Gateway Transaction ID
}
