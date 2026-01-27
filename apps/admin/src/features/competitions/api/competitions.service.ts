
import { supabase } from '@/lib/supabase';
import { Competition, CompetitionInsert, CompetitionUpdate, CompetitionFilters } from '../types/competition.types';

export const competitionsService = {
    /**
     * Fetch all competitions with optional filters
     */
    getAll: async (filters?: CompetitionFilters) => {
        let query = supabase
            .from('competitions')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status && filters.status.length > 0) {
            query = query.in('status', filters.status);
        }

        if (filters?.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }

        if (filters?.season) {
            query = query.eq('season', filters.season);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as Competition[];
    },

    /**
     * Get competition by ID
     */
    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Competition;
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
};
