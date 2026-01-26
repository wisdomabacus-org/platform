// types/mock-test.ts

export interface MockTest {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;

  // Config
  totalQuestions: number;
  totalMarks: number;
  duration: number; // in minutes (matches backend schema field name)

  // Grades
  minGrade: number;
  maxGrade: number;

  // Level/Category
  difficulty?: 'easy' | 'medium' | 'hard';

  // Metadata
  isPublished: boolean;
  isFree: boolean;

  createdAt: string;
  updatedAt: string;
}
