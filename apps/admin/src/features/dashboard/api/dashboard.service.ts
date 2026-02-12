
import { supabase } from '@/lib/supabase';
import { DashboardData, ActivityItem } from '../types/dashboard.types';

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardData> => {
        // 1. Fetch Total Users (students only — admins are in admin_users table, not profiles)
        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // 2. Fetch Active Competitions
        // Assuming 'open' or 'live' status means active
        const { count: activeCompetitions } = await supabase
            .from('competitions')
            .select('*', { count: 'exact', head: true })
            .in('status', ['open', 'live', 'published']);

        // 3. Fetch Total Revenue (ALL TIME - successful payments)
        // Removed month filter to show all-time revenue
        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'SUCCESS');

        // Amount is stored in paise, convert to rupees
        const totalRevenue = (payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0) / 100;

        // 4. Fetch Pending Demo Requests
        const { count: pendingDemoRequests } = await supabase
            .from('demo_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // 5. Fetch Recent Activity (Enrollments with explicit FK references)
        const { data: recentEnrollments } = await supabase
            .from('enrollments')
            .select(`
                id,
                created_at,
                status,
                profiles!user_id(student_name),
                competitions!competition_id(title)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        const activities: ActivityItem[] = (recentEnrollments || []).map((e: any) => ({
            id: e.id,
            type: 'enrollment',
            // Use table names since we use explicit FK references without aliases
            title: `Enrolled in ${e.competitions?.title || 'Competition'}`,
            user: e.profiles?.student_name || 'Unknown User',
            timestamp: e.created_at,
            status: e.status,
        }));

        return {
            stats: {
                totalUsers: totalUsers || 0,
                userGrowth: 12.5, // Mocked for now (requires historical data)
                activeCompetitions: activeCompetitions || 0,
                totalRevenue: totalRevenue || 0,
                revenueGrowth: 8.2, // Mocked
                pendingDemoRequests: pendingDemoRequests || 0,
            },
            recentActivity: activities,
        };
    },
};
