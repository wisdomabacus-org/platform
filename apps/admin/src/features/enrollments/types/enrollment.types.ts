
export type EnrollmentStatus = 'enrolled' | 'cancelled' | 'pending';

export interface Enrollment {
  id: string; // enrollment id
  userId: string;
  userName: string;
  userPhone: string;

  competitionId: string;
  competitionTitle: string;
  competitionSeason: string;

  status: string; // The enrollment table status (e.g. 'enrolled', 'cancelled')
  paymentId: string;

  isPaymentConfirmed: boolean;

  // Joined or computed fields
  registeredAt: Date;
  submissionId?: string | null;
}

export interface EnrollmentFilters {
  status?: string;
  search?: string; // Search by user name/competition
  competitionId?: string;
  isPaymentConfirmed?: boolean;
  page?: number;
  limit?: number;
}
