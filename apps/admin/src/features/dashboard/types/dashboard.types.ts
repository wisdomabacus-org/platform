
export interface DashboardStats {
    totalUsers: number;
    userGrowth: number; // percentage
    activeCompetitions: number;
    totalRevenue: number;
    revenueGrowth: number; // percentage
    pendingDemoRequests: number;
}

export interface ActivityItem {
    id: string;
    type: 'enrollment' | 'payment' | 'submission';
    title: string;
    user: string;
    timestamp: string;
    amount?: number;
    status: string;
}

export interface DashboardData {
    stats: DashboardStats;
    recentActivity: ActivityItem[];
}
