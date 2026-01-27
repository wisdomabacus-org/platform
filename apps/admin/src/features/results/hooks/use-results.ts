
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsService } from '../api/results.service';
import { competitionsService } from '@/features/competitions/api/competitions.service';
import { QUERY_KEYS } from '@/config/constants';
import { SubmissionFilters } from '../types/results.types';

// Fetch competitions that are relevant for results (ongoing, completed)
export function useResultCompetitions() {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, 'results-list'],
        queryFn: async () => {
            const all = await competitionsService.getAll();
            return all.filter(c => ['upcoming', 'ongoing', 'completed', 'published'].includes(c.status));
        }
    });
}

export function useLeaderboard(competitionId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.RESULTS, competitionId],
        queryFn: () => resultsService.getLeaderboard(competitionId),
        enabled: !!competitionId
    });
}

export function usePublishResults() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (competitionId: string) => resultsService.publishResults(competitionId),
        onSuccess: (_, competitionId) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESULTS, competitionId] });
        }
    });
}

export function useSubmissions(filters?: SubmissionFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.RESULTS, 'submissions', filters],
        queryFn: () => resultsService.getAllSubmissions(filters),
    });
}
