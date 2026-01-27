
export interface Referrer {
    id: string; // generated or uuid
    name: string;
    code: string;
    email?: string;
    phone?: string;

    // Stats
    totalReferrals: number;
    totalConversions: number; // e.g. paid enrollments
    totalRevenue?: number;

    createdAt: Date;
    status: 'active' | 'inactive';
}

export interface ReferrerFilters {
    search?: string;
}
