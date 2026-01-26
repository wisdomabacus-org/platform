// types/enrollment.ts

export interface Enrollment {
  id: string;
  userId: string;
  competitionId: string;
  paymentId: string;
  isPaymentConfirmed: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';

  // Snapshots from backend
  competitionSnapshot: {
    title: string;
    examDate: string; // ISO Date
    enrollmentFee: number;
  };

  userSnapshot: {
    name: string;
    email: string;
    grade: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentResponse {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  competitionTitle: string;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  enrollmentId?: string;
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  canStartExam?: boolean;
}
