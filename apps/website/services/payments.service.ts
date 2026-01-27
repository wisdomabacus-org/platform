/**
 * Payments Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with Supabase Edge Functions
 * and direct database queries.
 */

import { createClient } from '@/lib/supabase/client';
import type { PaymentVerificationData, PaymentStatusResponse } from '@/types/payment';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
  return createClient();
}

export const paymentsService = {
  /**
   * Verify Razorpay Payment
   * Uses the payment-verify Edge Function
   */
  verifyPayment: async (
    payload: PaymentVerificationData
  ): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();

    // Call Edge Function with snake_case payload (Edge function expects this)
    const { data, error } = await supabase.functions.invoke('payment-verify', {
      body: {
        payment_id: payload.paymentId,
        razorpay_order_id: payload.razorpayOrderId,
        razorpay_payment_id: payload.razorpayPaymentId,
        razorpay_signature: payload.razorpaySignature,
      },
    });

    if (error) {
      throw new Error(error.message || 'Payment verification failed');
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Payment verification failed');
    }

    return {
      success: true,
      message: data.message || 'Payment verified successfully',
    };
  },

  /**
   * Get Payment Status
   * Direct database query
   */
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const supabase = getSupabaseClient();

    const { data: payment, error } = await supabase
      .from('payments')
      .select('status, amount, currency, updated_at, gateway, razorpay_payment_id')
      .eq('id', paymentId)
      .single();

    if (error || !payment) {
      throw new Error('Payment not found');
    }

    // Map to expected frontend format
    return {
      status: (payment.status ?? 'PENDING') as PaymentStatusResponse['status'],
      amount: payment.amount,
      currency: payment.currency ?? 'INR',
      paidAt: payment.status === 'COMPLETED' ? payment.updated_at ?? undefined : undefined,
      method: payment.gateway ?? undefined,
      transactionId: payment.razorpay_payment_id ?? undefined,
    };
  },

  /**
   * Get Razorpay Key
   * Returns the public Razorpay key from environment
   * Note: This is the publishable key, safe to expose
   */
  getRazorpayKey: async (): Promise<{ keyId: string }> => {
    // The Razorpay key is returned by the enrollment function
    // But we can also have it in environment for convenience
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

    if (!keyId) {
      throw new Error('Razorpay configuration not found');
    }

    return { keyId };
  },
};
