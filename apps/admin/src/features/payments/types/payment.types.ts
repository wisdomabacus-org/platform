
export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;

  amount: number;
  currency: string;
  status: PaymentStatus;
  purpose: string; // e.g., 'competition_enrollment', 'wallet_topup'
  referenceId: string; // e.g., enrollment_id or other internal ref

  gateway?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  failureReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // joined fields (optional)
  userSnapshot?: any;
}

export interface PaymentFilters {
  status?: string;
  search?: string; // payment ID, order ID, email, name
  dateRange?: { from: Date; to: Date };
  page?: number;
  limit?: number;
}

export interface RevenueStats {
  totalRevenue: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
}
