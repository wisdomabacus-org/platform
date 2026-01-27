
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '../api/enrollments.service';
import { EnrollmentFilters } from '../types/enrollment.types';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';

export function useEnrollments(filters?: EnrollmentFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.ENROLLMENTS, filters],
        queryFn: () => enrollmentsService.getAll(filters),
    });
}

export function useCreateEnrollment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enrollmentsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
            toast.success('Enrollment created successfully');
        },
        onError: (error) => {
            toast.error(`Failed to enroll: ${error.message}`);
        }
    });
}

export function useUpdateEnrollmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            enrollmentsService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
            toast.success('Status updated successfully');
        },
        onError: (error) => {
            toast.error(`Failed to update status: ${error.message}`);
        }
    });
}
