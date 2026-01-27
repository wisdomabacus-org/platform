
export type AuthProvider = 'google' | 'phone' | 'email';

export interface User {
  id: string; // UUID from profiles table
  uid: string; // auth.users.id mapped
  authProvider: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  studentName: string | null;
  parentName: string | null;
  studentGrade: number | null;
  schoolName: string | null;
  city: string | null;
  state: string | null;
  isProfileComplete: boolean;
  dateOfBirth: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Computed/Joined fields (optional)
  enrollmentCount?: number;
}

export interface UserFilters {
  search?: string;
  authProvider?: string;
  isProfileComplete?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
