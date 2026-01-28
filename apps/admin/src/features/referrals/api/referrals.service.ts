
import { supabase } from '@/lib/supabase';
import { Referrer } from '../types/referrals.types';

export const referralsService = {
    getAll: async () => {
        // 1. Fetch referrers from DB
        const { data: referrers, error: referrerError } = await (supabase
            .from('referrers' as any)
            .select('*')
            .order('created_at', { ascending: false })) as any;

        if (referrerError) throw referrerError;

        // 2. Fetch aggregation of referrals from profiles to calculate stats
        // We fetch counts grouped by referred_by_code
        // Note: Supabase doesn't support direct GROUP BY with counts easily in client without RPC, 
        // so we'll fetch profiles with valid codes and aggregate in JS for MVP scale.
        const { data: usageData, error: usageError } = await supabase
            .from('profiles')
            .select('referred_by_code')
            .not('referred_by_code', 'is', null);

        if (usageError) throw usageError;

        // Aggregate counts
        const counts: Record<string, number> = {};
        usageData?.forEach((p: any) => {
            const c = p.referred_by_code?.toUpperCase();
            if (c) counts[c] = (counts[c] || 0) + 1;
        });

        // 3. Map referrers with stats
        const result: Referrer[] = (referrers || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            email: r.email,
            phone: r.phone,
            status: r.status,
            createdAt: new Date(r.created_at),
            totalReferrals: counts[r.code?.toUpperCase()] || 0,
            totalConversions: 0, // Placeholder: requires joining enrollments/payments
        }));

        return result;
    },

    create: async (payload: Partial<Referrer>) => {
        const { data, error } = await supabase
            .from('referrers' as any)
            .insert([{
                name: payload.name,
                code: payload.code,
                email: payload.email,
                phone: payload.phone,
                status: payload.status
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async ({ id, ...payload }: Partial<Referrer> & { id: string }) => {
        const { data, error } = await supabase
            .from('referrers' as any)
            .update({
                name: payload.name,
                // code: payload.code, // Code usually shouldn't change to avoid breaking links, but allows if needed
                email: payload.email,
                phone: payload.phone,
                status: payload.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('referrers' as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
