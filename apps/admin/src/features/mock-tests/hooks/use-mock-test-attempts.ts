import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTestAttemptsService } from '../api/mock-test-attempts.service';
import { QUERY_KEYS } from '@/config/constants';
import { handleMutationError, handleMutationSuccess } from '@/lib/error-handler';

/**
 * Hook to get all attempts for a specific mock test
 */
export function useMockTestAttempts(
  mockTestId: string,
  options?: { page?: number; limit?: number; enabled?: boolean }
) {
  const { page = 0, limit = 50, enabled = true } = options || {};

  return useQuery({
    queryKey: [QUERY_KEYS.MOCK_TESTS, mockTestId, 'attempts', { page, limit }],
    queryFn: () => mockTestAttemptsService.getByMockTest(mockTestId, { page, limit }),
    enabled: !!mockTestId && enabled,
  });
}

/**
 * Hook to get attempts statistics for a mock test
 */
export function useMockTestAttemptStats(mockTestId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.MOCK_TESTS, mockTestId, 'attempt-stats'],
    queryFn: () => mockTestAttemptsService.getStats(mockTestId),
    enabled: !!mockTestId,
  });
}

/**
 * Hook to get attempts by a specific user
 */
export function useUserMockTestAttempts(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, userId, 'mock-test-attempts'],
    queryFn: () => mockTestAttemptsService.getByUser(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to check if current user has attempted a mock test
 */
export function useCheckMockTestAttempt(userId: string | undefined, mockTestId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.MOCK_TESTS, mockTestId, 'has-attempted', userId],
    queryFn: () => {
      if (!userId) return false;
      return mockTestAttemptsService.hasUserAttempted(userId, mockTestId);
    },
    enabled: !!userId && !!mockTestId,
  });
}

/**
 * Hook to delete a mock test attempt (irreversible operation)
 */
export function useDeleteMockTestAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mockTestId: _mockTestId }: { id: string; mockTestId: string }) =>
      mockTestAttemptsService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MOCK_TESTS, variables.mockTestId, 'attempts']
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MOCK_TESTS, variables.mockTestId, 'attempt-stats']
      });
      handleMutationSuccess('Attempt record deleted successfully');
    },
    onError: (error) => {
      handleMutationError(error, {
        fallbackMessage: 'Failed to delete attempt record',
        context: 'Delete Attempt',
      });
    },
  });
}
