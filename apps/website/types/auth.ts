/**
 * User type from backend
 */
export interface User {
  id: string;
  uid?: string; // Added UID field
  email?: string;
  phone?: string;
  authProvider: "email" | "phone" | "google";
  parentName?: string;
  studentName?: string;
  studentGrade?: number;
  schoolName?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  isProfileComplete: boolean;
  emailVerified?: boolean;
  enrolledCompetitions?: string[];
  activeSubscription?: string | null;
  attemptedMockTests?: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  parentName: string;
  studentName: string;
  studentGrade: number;
  schoolName: string;
  city: string;
  state: string;
  phone: string;
  dateOfBirth: string; // ISO date string
}

// Alias for consistency
export type UpdateUserProfileData = UpdateProfileDto;

/**
 * Auth response types
 */
export interface LoginResponse {
  user: User;
  message?: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}