// types/exam.ts

export interface StartExamResponse {
  success: boolean;
  message: string;
  data: {
    examPortalUrl: string;
    examTitle: string;
    totalQuestions: number;
    durationMinutes: number;
  };
}
