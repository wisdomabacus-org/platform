import { useQuery } from '@tanstack/react-query';
import { questionBankUsageService } from '../api/question-bank-usage.service';
import { QUERY_KEYS } from '@/config/constants';

/**
 * Hook to get where a question bank is assigned (competitions and mock tests)
 */
export function useQuestionBankUsage(questionBankId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTION_BANKS, questionBankId, 'usage'],
    queryFn: () => questionBankUsageService.getUsage(questionBankId),
    enabled: !!questionBankId,
  });
}

/**
 * Hook to check if a question bank can be deleted
 */
export function useCanDeleteQuestionBank(questionBankId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTION_BANKS, questionBankId, 'can-delete'],
    queryFn: () => questionBankUsageService.canDelete(questionBankId),
    enabled: !!questionBankId,
  });
}

/**
 * Hook to get usage statistics for all question banks
 */
export function useQuestionBankUsageStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTION_BANKS, 'usage-stats'],
    queryFn: () => questionBankUsageService.getUsageStats(),
  });
}
