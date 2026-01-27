
export interface MockTest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: number; // minutes
  total_questions: number;
  min_grade: number;
  max_grade: number;
  is_active: boolean;
  is_published: boolean;
  is_locked: boolean;
  attempt_count: number;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MockTestFilters {
  search?: string;
  difficulty?: string;
  is_published?: boolean;
  page?: number;
  limit?: number;
}

export interface MockTestAssignment {
  question_bank_id: string;
  grades: number[];
}
