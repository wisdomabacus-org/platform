
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTestsService } from '../api/mock-tests.service';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';

export function useMockTests() {
    return useQuery({
        queryKey: [QUERY_KEYS.MOCK_TESTS],
        queryFn: mockTestsService.getAll,
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
            toast.success('Mock test created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create mock test');
            console.error(error);
        }
    });
}

export function useUpdateMockTest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => mockTestsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS] });
            toast.success('Mock test updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update mock test');
            console.error(error);
        }
    });
}

export function useDeleteMockTest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: mockTestsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOCK_TESTS] });
            toast.success('Mock test deleted');
        },
        onError: (error) => {
            toast.error('Failed to delete mock test');
            console.error(error);
        }
    });
}
