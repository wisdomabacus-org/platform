export interface MockTest {
  id: string;
  title: string;
  gradeLevel: number;       // 1-12
  isFree: boolean;          // free or paid
  durationMinutes: number;  // >= 1
  isPublished: boolean;     // draft/published
  questionsCount: number;   // derived: questions.length (for list UI)
  createdAt: Date;
}
