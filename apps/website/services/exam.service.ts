// services/exam.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { StartExamResponse } from "@/types/exam";

export const examService = {
  /**
   * Start Exam Session (Redirects to Vite Portal)
   * POST /exam/start
   */
  startExam: async (
    examId: string,
    examType: 'competition' | 'mock-test'
  ): Promise<StartExamResponse> => {
    const response = await apiClient.post("/exam/start", {
      examId,
      examType,
    }) as ApiResponse<StartExamResponse>;
    return response.data!;
  },
};
