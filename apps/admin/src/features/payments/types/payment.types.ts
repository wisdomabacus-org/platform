export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash';

export interface Payment {
  id: string;
  orderId: string;
  userName: string;
  userPhone: string;
  competitionId: string;
  competitionTitle: string;
  amount: number;
  currency: 'INR';
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}
