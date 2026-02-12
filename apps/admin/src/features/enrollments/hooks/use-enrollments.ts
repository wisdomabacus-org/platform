import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '../api/enrollments.service';
import { EnrollmentFilters } from '../types/enrollment.types';
import { QUERY_KEYS } from '@/config/constants';
import { handleMutationError, handleMutationSuccess } from '@/lib/error-handler';

export function useEnrollments(filters?: EnrollmentFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.ENROLLMENTS, filters],
        queryFn: () => enrollmentsService.getAll(filters),
    });
}

export function useEnrollment(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.ENROLLMENTS, id],
        queryFn: () => enrollmentsService.getById(id),
        enabled: !!id,
    });
}

export function useCreateEnrollment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enrollmentsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            handleMutationSuccess('Enrollment created successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to create enrollment',
                context: 'Create Enrollment',
            });
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
            handleMutationSuccess('Status updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update status',
                context: 'Update Status',
            });
        }
    });
}

export function useDeleteEnrollment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => enrollmentsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            handleMutationSuccess('Enrollment deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete enrollment',
                context: 'Delete Enrollment',
            });
        }
    });
}
