
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsService } from '../api/exam-sessions.service';
import { toast } from 'sonner';

const QUERY_KEY = ['exam-sessions', 'active'];

export function useActiveExamSessions() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: examSessionsService.getActiveSessions,
        refetchInterval: 10000, // Auto-refresh every 10 seconds
    });
}

export function useForceFinishSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: examSessionsService.forceFinish,
        onSuccess: () => {
            toast.success('Session force-submitted successfully');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (e) => {
            toast.error('Failed to update session');
        }
    });
}
