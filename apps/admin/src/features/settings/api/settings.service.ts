
import { supabase } from '@/lib/supabase';
import { AdminProfile, SystemSettings } from '../types/settings.types';

// Mock initial settings
let MOCK_SETTINGS: SystemSettings = {
    platformName: 'Wisdom Abacus Admin',
    maintenanceMode: false,
    supportEmail: 'support@wisdomabacus.com',
    allowRegistrations: true,
};

export const settingsService = {
    getSystemSettings: async (): Promise<SystemSettings> => {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 500));
        return { ...MOCK_SETTINGS };
    },

    updateSystemSettings: async (settings: Partial<SystemSettings>) => {
        await new Promise(r => setTimeout(r, 800));
        MOCK_SETTINGS = { ...MOCK_SETTINGS, ...settings };
        return MOCK_SETTINGS;
    },

    getAdminProfile: async (): Promise<AdminProfile> => {
        const { data: { user } } = await supabase.auth.getUser();

        // If using Supabase Auth, we get user metadata.
        // If using 'admin_users' table, we might filter by email.
        // For now, return hybrid info.

        return {
            id: user?.id || 'admin-id',
            username: user?.email || 'admin@example.com',
            lastLogin: new Date(user?.last_sign_in_at || Date.now()),
            role: 'Super Admin',
        };
    }
};
