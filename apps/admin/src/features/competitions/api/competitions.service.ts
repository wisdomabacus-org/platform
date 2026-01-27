
import { supabase } from '@/lib/supabase';
import { Competition, CompetitionInsert, CompetitionUpdate, CompetitionFilters } from '../types/competition.types';

export const competitionsService = {
    /**
     * Fetch all competitions with optional filters and pagination
     */
    getAll: async (filters?: CompetitionFilters & { page?: number; limit?: number }) => {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('competitions')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (filters?.status && filters.status.length > 0) {
            query = query.in('status', filters.status);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
        }

        if (filters?.season) {
            query = query.eq('season', filters.season);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        return {
            data: data as Competition[],
            count: count || 0,
        };
    },

    /**
     * Get competition by ID with syllabus and prizes
     */
    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .select(`
                *,
                competition_syllabus (*),
                competition_prizes (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new competition
     */
    create: async (competition: CompetitionInsert) => {
        const { data, error } = await supabase
            .from('competitions')
            .insert(competition)
            .select()
            .single();

        if (error) throw error;
        return data as Competition;
    },

    /**
     * Update a competition
     */
    update: async (id: string, updates: CompetitionUpdate) => {
        const { data, error } = await supabase
            .from('competitions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Competition;
    },

    /**
     * Delete a competition
     */
    delete: async (id: string) => {
        const { error } = await supabase
            .from('competitions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    /**
     * Update competition syllabus
     */
    updateSyllabus: async (competitionId: string, topics: any[]) => {
        // First delete existing syllabus
        await supabase.from('competition_syllabus').delete().eq('competition_id', competitionId);

        // Then insert new ones
        if (topics.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_syllabus')
            .insert(topics.map((t, index) => ({
                ...t,
                competition_id: competitionId,
                sort_order: t.sort_order ?? index
            })))
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Update competition prizes
     */
    updatePrizes: async (competitionId: string, prizes: any[]) => {
        // First delete existing prizes
        await supabase.from('competition_prizes').delete().eq('competition_id', competitionId);

        // Then insert new ones
        if (prizes.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_prizes')
            .insert(prizes.map(p => ({
                ...p,
                competition_id: competitionId
            })))
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Get assigned question banks
     */
    getQuestionBanks: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('competition_question_banks')
            .select(`
                *,
                question_banks (*)
            `)
            .eq('competition_id', competitionId);

        if (error) throw error;
        return data;
    },

    /**
     * Assign question banks to competition
     */
    assignQuestionBanks: async (competitionId: string, assignments: { question_bank_id: string, grades: number[] }[]) => {
        // First clear existing assignments
        await supabase.from('competition_question_banks').delete().eq('competition_id', competitionId);

        if (assignments.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_question_banks')
            .insert(assignments.map(a => ({
                competition_id: competitionId,
                question_bank_id: a.question_bank_id,
                grades: a.grades
            })))
            .select();

        if (error) throw error;
        return data;
    }
};
