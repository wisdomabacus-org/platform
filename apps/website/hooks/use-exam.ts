// hooks/use-exam.ts
import { useMutation } from "@tanstack/react-query";
import { examService } from "@/services/exam.service";
import { toast } from "sonner";
import { useAuthModal } from "@/stores/modal-store";

// Helper to get user-friendly error message
function getErrorMessage(error: any): string {
  // If it's a string, return it directly
  if (typeof error === 'string') return error;

  // If it has a message property
  if (error?.message) {
    const message = error.message;

    // CORS errors
    if (message.includes('CORS') || message.includes('Failed to send')) {
      return 'Connection error. Please try again in a moment.';
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Already attempted
    if (message.includes('already attempted') || message.includes('already submitted')) {
      return 'You have already completed this mock test. You can only attempt it once.';
    }

    // Not enrolled
    if (message.includes('not enrolled')) {
      return 'You are not enrolled in this competition. Please enroll first.';
    }

    // Grade mismatch
    if (message.includes('grades')) {
      return message; // Return as-is since it's descriptive
    }

    // Session expired
    if (message.includes('expired')) {
      return 'Your session has expired. Please login again.';
    }

    // Unauthorized
    if (message.includes('Unauthorized') || message.includes('login')) {
      return 'Please login to start the exam.';
    }

    // Exam window issues
    if (message.includes('not started yet')) {
      return 'The exam has not started yet. Please check the schedule.';
    }

    if (message.includes('window has closed')) {
      return 'The exam window has closed. You can no longer start this exam.';
    }

    return message;
  }

  return "Failed to start exam. Please try again.";
}

export function useStartExam() {
  const { onOpen: openAuthModal } = useAuthModal();

  return useMutation({
    mutationFn: ({ examId, examType }: { examId: string; examType: 'competition' | 'mock-test' }) =>
      examService.startExam(examId, examType),
    retry: 0,
    onSuccess: (response) => {
      // Show success toast before redirect
      toast.success("Exam starting... Good luck!", {
        duration: 2000,
      });

      setTimeout(() => {
        // Redirect to the Vite Exam Portal
        window.location.href = response.data.examPortalUrl;
      }, 100);
    },
    onError: (error: any) => {
      console.error("useStartExam error:", error);

      const message = getErrorMessage(error);

      // Check if user needs to login
      if (message.includes('login') || message.includes('Unauthorized')) {
        toast.error(message, {
          action: {
            label: "Login",
            onClick: () => openAuthModal(),
          },
          duration: 5000,
        });
        return;
      }

      // Show error toast with appropriate message
      toast.error(message, {
        duration: 5000,
      });
    },
  });
}
