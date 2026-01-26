// services/payments.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import { PaymentVerificationData, PaymentStatusResponse } from "@/types/payment";

export const paymentsService = {

  /**
   * Verify Razorpay Payment on Backend
   * POST /payments/verify
   */
  verifyPayment: async (payload: PaymentVerificationData): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(
      "/payments/verify",
      payload
    ) as ApiResponse<{ success: boolean; message: string }>;
    return response.data!;
  },

  /**
   * Get Payment Status
   * GET /payments/:paymentId/status
   */
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get(
      `/payments/${paymentId}/status`
    ) as ApiResponse<PaymentStatusResponse>;
    return response.data!;
  },

  /**
   * Get Razorpay Key
   * GET /payments/key
   */
  getRazorpayKey: async (): Promise<{ keyId: string }> => {
    const response = await apiClient.get("/payments/config") as ApiResponse<{ keyId: string }>;
    return response.data!;
  }
};
