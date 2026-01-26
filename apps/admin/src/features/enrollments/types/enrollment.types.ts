export type EnrollmentStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface Enrollment {
  id: string;
  userName: string;
  userPhone: string;
  competitionId: string;
  competitionTitle: string;
  grade: number;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  orderId: string;
  registeredAt: Date;
}
