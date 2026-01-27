
import { supabase } from '@/lib/supabase';
import { CompetitionResultsRow, Submission, SubmissionFilters, LeaderboardRow } from '../types/results.types';

export const resultsService = {
    // Existing methods for Competitions Results
    getCompetitions: async () => {
        // Fetch competitions to show status
        const { data, error } = await supabase
            .from('competitions')
            .select(`*, enrolled_count:enrollments(count)`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    getLeaderboard: async (competitionId: string): Promise<LeaderboardRow[]> => {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                id,
                score,
                rank,
                exam_snapshot,
                profile:profiles(student_name)
            `)
            .eq('competition_id', competitionId)
            .not('score', 'is', null)
            .order('score', { ascending: false });

        if (error) throw error;

        return data.map((entry: any, index: number) => ({
            id: entry.id,
            studentName: entry.profile?.student_name || 'Unknown',
            score: entry.score,
            rank: entry.rank || index + 1,
            grade: entry.exam_snapshot?.grade || 0,
        }));
    },

    publishResults: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .update({ status: 'completed' }) // MVP toggle
            .eq('id', competitionId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // New methods for Submissions Dashboard
    getAllSubmissions: async (filters?: SubmissionFilters) => {
        let query = supabase
            .from('submissions')
            .select(`
            *,
            profile:profiles(student_name),
            competition:competitions(title),
            mock_test:mock_tests(title)
        `, { count: 'exact' });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        // examType filtering implies checking nullity of foreign keys or 'exam_type' column
        if (filters?.examType) {
            query = query.eq('exam_type', filters.examType);
        }

        if (filters?.dateRange?.from) {
            query = query.gte('submitted_at', filters.dateRange.from.toISOString());
        }
        if (filters?.dateRange?.to) {
            query = query.lte('submitted_at', filters.dateRange.to.toISOString());
        }

        query = query.order('submitted_at', { ascending: false });

        const { data, error, count } = await query;
        if (error) throw error;

        return {
            data: data.map((s: any) => ({
                id: s.id,
                userId: s.user_id,
                userName: s.profile?.student_name || '—',
                examType: s.exam_type,
                examId: s.competition_id || s.mock_test_id,
                examTitle: s.competition?.title || s.mock_test?.title || 'Unknown',
                score: s.score || 0,
                totalQuestions: s.total_questions || 0,
                timeTaken: s.time_taken || 0,
                status: s.status || 'unknown',
                submittedAt: s.submitted_at ? new Date(s.submitted_at) : new Date(s.created_at),
                startedAt: new Date(s.started_at),
            })) as Submission[],
            count
        };
    }
};
