// hooks/use-exam.ts
import { useMutation } from "@tanstack/react-query";
import { examService } from "@/services/exam.service";
import { toast } from "sonner";

export function useStartExam() {
  return useMutation({
    mutationFn: ({ examId, examType }: { examId: string; examType: 'competition' | 'mock-test' }) =>
      examService.startExam(examId, examType),
    onSuccess: (response) => {
      // Redirect to the Vite Exam Portal
      window.location.href = response.data.examPortalUrl;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start exam. Please try again.");
    },
  });
}
