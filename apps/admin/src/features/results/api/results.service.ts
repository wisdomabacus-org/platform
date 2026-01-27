
import { supabase } from '@/lib/supabase';
import { CompetitionResultsRow } from '../types/results.types';

export const resultsService = {
    /**
     * Get leaderboard for a competition
     * Assuming enrollments table holds the score and user info
     */
    getLeaderboard: async (competitionId: string) => {
        // adjust query based on actual schema relationships
        // assuming enrollment has user_id and we join with users or profiles
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                score,
                rank,
                grade,
                student:users!inner (
                    full_name,
                    email
                )
            `)
            .eq('competition_id', competitionId)
            .not('score', 'is', null) // only those with scores
            .order('score', { ascending: false });

        if (error) throw error;

        // Map to simpler structure
        return data.map((entry: any) => ({
            id: entry.id,
            studentName: entry.student?.full_name || 'Unknown',
            score: entry.score,
            rank: entry.rank,
            grade: entry.grade,
            studentId: entry.student?.id // if available
        }));
    },

    /**
     * Publish results for a competition
     * This might set a flag or update status
     */
    publishResults: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .update({ status: 'completed' }) // or specific flag
            .eq('id', competitionId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
