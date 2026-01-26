export enum AuthProvider {
  GOOGLE = 'google',
  PHONE = 'phone',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface AttemptedMockTest {
  mockTestId: string;
  submissionId: string;
}

export interface User {
  id: string;
  authProvider: AuthProvider;
  phone: string;
  email?: string;
  googleId?: string;
  parentName?: string;
  studentName?: string;
  studentGrade?: number;
  schoolName?: string;
  city?: string;
  state?: string;
  isProfileComplete: boolean;
  status: UserStatus;
  adminNotes?: string;
  enrolledCompetitions: string[];
  attemptedMockTests: AttemptedMockTest[];
  activeSubscription: string | null;
  createdAt: string;
  updatedAt: string;
}
