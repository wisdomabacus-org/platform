
import { supabase } from '@/lib/supabase';
import { Referrer } from '../types/referrals.types';

// Mock list of known referrers for MVP since there's no dedicated table
const MOCK_REFERRERS: Partial<Referrer>[] = [
    { id: '1', name: 'John Teacher', code: 'JOHN20', email: 'john@school.com', phone: '9876543210', status: 'active', createdAt: new Date('2024-01-01') },
    { id: '2', name: 'City School', code: 'CITY50', email: 'admin@cityschool.edu', phone: '044-123456', status: 'active', createdAt: new Date('2024-02-15') },
    { id: '3', name: 'Promo Summer', code: 'SUMMER24', status: 'active', createdAt: new Date('2024-05-01') },
];

export const referralsService = {
    getAll: async () => {
        // 1. Fetch aggregation of referrals from profiles
        // usage: { 'JOHN20': 15, 'CITY50': 5 }
        // Since we can't do extensive group-by easily without RPC, we might fetch specific codes or fetch all profiles with non-null referred_by_code.
        // Given the scale might be small, we fetch active referrals.

        // Fetch profiles that have a referred_by_code
        const { data: usageData, error } = await supabase
            .from('profiles')
            .select('referred_by_code, id')
            .not('referred_by_code', 'is', null);

        if (error) throw error;

        // Aggregate counts
        const counts: Record<string, number> = {};
        usageData.forEach((p: any) => {
            const c = p.referred_by_code?.toUpperCase();
            if (c) counts[c] = (counts[c] || 0) + 1;
        });

        // 2. Fetch conversions (enrollments with payment confirmed) - NOT EASY to link efficiently without joins.
        // For MVP, we'll just track sign-ups (Total Referrals).

        // 3. Merge with Mock Referrers or create ad-hoc entries for unknown codes
        const result: Referrer[] = [...MOCK_REFERRERS].map(r => ({
            ...r,
            totalReferrals: counts[r.code!] || 0,
            totalConversions: 0, // Pending implementation
        })) as Referrer[];

        // Add unknown codes found in DB
        Object.keys(counts).forEach(code => {
            if (!result.find(r => r.code === code)) {
                result.push({
                    id: code, // use code as id for ad-hoc
                    name: 'Unknown / Ad-hoc',
                    code: code,
                    totalReferrals: counts[code],
                    totalConversions: 0,
                    createdAt: new Date(),
                    status: 'active'
                });
            }
        });

        return result;
    },

    create: async (payload: Partial<Referrer>) => {
        // Stub
        console.log('Creating referrer', payload);
        return payload;
    }
};
