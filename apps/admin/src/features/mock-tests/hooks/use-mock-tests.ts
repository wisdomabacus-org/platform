import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTestsService } from '../api/mock-tests.service';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';
import { MockTestFilters, MockTestAssignment } from '../types/mock-test.types';
import { handleMutationError, handleMutationSuccess } from '@/lib/error-handler';

export function useMockTests(filters?: MockTestFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.MOCK_TESTS, filters],
        queryFn: () => mockTestsService.getAll(filters),
    });
}

export function useMockTest(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.MOCK_TESTS, id],
        queryFn: () => mockTestsService.getById(id),
        enabled: !!id,
    });
}

export function useCreateMockTest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: mockTestsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS] });
            handleMutationSuccess('Mock test created successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to create mock test',
                context: 'Create Mock Test',
            });
        }
    });
}

export function useUpdateMockTest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => mockTestsService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS, variables.id] });
            handleMutationSuccess('Mock test updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update mock test',
                context: 'Update Mock Test',
            });
        }
    });
}

export function useDeleteMockTest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: mockTestsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS] });
            handleMutationSuccess('Mock test deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete mock test',
                context: 'Delete Mock Test',
            });
        }
    });
}

export function useMockTestQuestionBanks(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.MOCK_TESTS, id, 'question-banks'],
        queryFn: () => mockTestsService.getQuestionBanks(id),
        enabled: !!id,
    });
}

export function useAssignMockTestQuestionBanks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, assignments }: { id: string; assignments: MockTestAssignment[] }) =>
            mockTestsService.assignQuestionBanks(id, assignments),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS, variables.id, 'question-banks'] });
            handleMutationSuccess('Question banks assigned successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to assign question banks',
                context: 'Assign Question Banks',
            });
        }
    });
}
