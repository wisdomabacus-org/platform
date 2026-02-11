export interface SyllabusItem {
  topic: string;
  description?: string;
}

export interface PrizeDetails {
  rank: number;
  title: string;
  description?: string;
  cashPrize: number;
  worth?: number;
  type: 'trophy' | 'medal' | 'certificate' | 'cash';
}

export interface Competition {
  id: string; // Clean ID from backend transform
  title: string;
  slug: string;
  season: string;
  description: string;
  status: 'open' | 'closed' | 'upcoming' | 'completed' | 'live';

  // Dates (ISO Strings)
  registrationStartDate: string;
  registrationEndDate: string;
  examDate: string;
  examWindowStart: string;
  examWindowEnd: string;
  resultsDate?: string;

  // Details
  duration: number; // in minutes
  enrollmentFee: number;
  originalFee?: number;
  minGrade: number;
  maxGrade: number;

  // Content
  syllabus: SyllabusItem[];
  prizes: PrizeDetails[];

  // Stats & Config
  isTrainingAvailable: boolean;
  totalQuestions: number;
  totalMarks: number;
  enrolledCount: number;
  viewCount: number;
  seatsLimit: number;
  waitlistCount: number;

  // Flags
  isFeatured: boolean;
  isResultsPublished: boolean;
  isPublished: boolean;

  // Virtuals (if passed)
  isRegistrationOpen?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CompetitionResults {
  competitionTitle: string;
  results: Array<{
    rank: number;
    studentName: string;
    studentGrade?: number;
    schoolName?: string;
    city?: string;
    score: number;
    timeTaken?: number; // in seconds
    submittedAt?: string;
  }>;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  enrollmentId?: string;
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  canStartExam?: boolean;
}

export interface CompetitionListQuery {
  page?: number;
  limit?: number;
  minGrade?: number;
  maxGrade?: number;
  status?: Competition['status'];
  isPublished?: boolean;
  search?: string;
}
