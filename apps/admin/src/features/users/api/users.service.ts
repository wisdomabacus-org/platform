
import { supabase } from '@/lib/supabase';
import { User, UserFilters } from '../types/user.types';

export const usersService = {
    getAll: async (filters: UserFilters = {}) => {
        const { search, authProvider, status, isProfileComplete, isVerified, page = 0, limit = 10 } = filters;

        // Note: profiles table contains all users including admins.
        // We filter out admin users to only show students/regular users.
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .neq('role', 'admin'); // Exclude admin users

        if (authProvider) {
            query = query.eq('auth_provider', authProvider);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (isProfileComplete !== undefined) {
            query = query.eq('is_profile_complete', isProfileComplete);
        }

        if (isVerified !== undefined) {
            query = query.eq('email_verified', isVerified);
        }

        if (search) {
            const searchTerm = `%${search}%`;
            query = query.or(`uid.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm},student_name.ilike.${searchTerm}`);
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            data: (data || []).map((profile: any) => ({
                id: profile.id,
                uid: profile.uid,
                authProvider: profile.auth_provider,
                email: profile.email,
                phone: profile.phone,
                emailVerified: profile.email_verified || false,
                studentName: profile.student_name,
                parentName: profile.parent_name,
                studentGrade: profile.student_grade,
                schoolName: profile.school_name,
                status: profile.status || 'active',
                role: profile.role || 'user',
                city: profile.city,
                state: profile.state,
                isProfileComplete: profile.is_profile_complete || false,
                dateOfBirth: profile.date_of_birth || null,
                lastLogin: profile.last_login ? new Date(profile.last_login) : null,
                createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
                updatedAt: profile.updated_at ? new Date(profile.updated_at) : new Date(),
            })) as User[],
            total: count || 0,
            page,
            limit
        };
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            uid: data.uid,
            authProvider: data.auth_provider,
            email: data.email,
            phone: data.phone,
            emailVerified: data.email_verified || false,
            studentName: data.student_name,
            parentName: data.parent_name,
            studentGrade: data.student_grade,
            schoolName: data.school_name,
            city: data.city,
            state: data.state,
            isProfileComplete: data.is_profile_complete || false,
            dateOfBirth: data.date_of_birth || null,
            lastLogin: data.last_login ? new Date(data.last_login) : null,
            createdAt: data.created_at ? new Date(data.created_at) : new Date(),
            updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
        } as User;
    },

    // Note: Creating a user profil usually implies creating an auth user first. 
    // For bulk import, we might just insert profiles if we handle auth separately 
    // or use admin.createUser (Supabase Admin API) which requires backend usage.
    // For now, assume client-side insert is restricted or we are just adding profiles for existing auth users.
    // However, "Bulk User Registration" is Task 7.3. We'll handle that later.

    getEnrollments: async (userId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                competition:competitions (
                    title,
                    season
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    bulkCreate: async (users: any[]) => {
        // This requires a Supabase Edge Function to use the service_role key 
        // to create users in auth.users and then profiles.
        // Example: 
        // const { data, error } = await supabase.functions.invoke('admin-bulk-create-users', { body: { users } });
        // if (error) throw error;
        // return data;

        console.log("Mock bulk create:", users);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, count: users.length };
    },

    updateStatus: async (id: string, status: 'active' | 'suspended') => {
        const { error } = await supabase
            .from('profiles')
            .update({ status } as any)
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // NOTE: This only deletes the profile. Auth user deletion requires Edge Function or Admin API.
    // For now assuming profile delete triggers cascade or is sufficient for view hiding if we fail on auth delete.
    deleteUser: async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
