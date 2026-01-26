import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentsService } from "@/services/enrollments.service";
import { toast } from "sonner";

/**
 * Get my enrollments
 */
export function useMyEnrollments() {
  return useQuery({
    queryKey: ["my-enrollments"],
    queryFn: enrollmentsService.getMyEnrollments,
  });
}

/**
 * Check enrollment status for a specific competition
 */
export function useEnrollmentStatus(competitionId: string) {
  return useQuery({
    queryKey: ["enrollment-status", competitionId],
    queryFn: () => enrollmentsService.checkStatus(competitionId),
    enabled: !!competitionId,
    retry: false,
  });
}

/**
 * Create enrollment mutation
 * Returns Razorpay payment details
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (competitionId: string) =>
      enrollmentsService.createEnrollment(competitionId),
    onSuccess: (data, competitionId) => {
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-status", competitionId],
      });

      toast.success("Enrollment created! Opening payment gateway...");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create enrollment");
    },
  });
}
