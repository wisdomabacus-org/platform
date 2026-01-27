
import { supabase } from '@/lib/supabase';
import { AnyRequest, ContactRequest, DemoRequest, RequestFilters } from '../types/requests.types';

export const requestsService = {
    getAll: async (filters?: RequestFilters) => {
        // 1. Fetch Contact Requests
        let contactQuery = supabase
            .from('contact_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50); // limit for MVP mixed view

        if (filters?.status) contactQuery = contactQuery.eq('status', filters.status);

        // 2. Fetch Demo Requests
        let demoQuery = supabase
            .from('demo_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (filters?.status) demoQuery = demoQuery.eq('status', filters.status);

        const [contactRes, demoRes] = await Promise.all([contactQuery, demoQuery]);

        if (contactRes.error) throw contactRes.error;
        if (demoRes.error) throw demoRes.error;

        // 3. Normalize
        const contacts: ContactRequest[] = contactRes.data.map((r: any) => ({
            id: r.id,
            type: 'contact',
            status: r.status || 'pending',
            createdAt: new Date(r.created_at),
            updatedAt: new Date(r.updated_at || r.created_at),
            userEmail: r.email,
            userPhone: r.phone,
            userName: r.name,
            subject: r.subject,
            message: r.message,
            adminResponse: r.admin_response,
        }));

        const demos: DemoRequest[] = demoRes.data.map((r: any) => ({
            id: r.id,
            type: 'demo',
            status: r.status || 'pending',
            createdAt: new Date(r.created_at),
            updatedAt: new Date(r.updated_at || r.created_at),
            userEmail: r.email,
            userPhone: r.phone,
            userName: r.parent_name, // Using parent name as primary contact
            studentName: r.student_name,
            parentName: r.parent_name,
            grade: r.grade,
            slot: r.slot,
            adminNotes: r.admin_notes,
        }));

        // 4. Merge and Sort
        let all: AnyRequest[] = [...contacts, ...demos];

        // Filter by Type if needed
        if (filters?.type) {
            all = all.filter(r => r.type === filters.type);
        }

        // Search filter (client-side)
        if (filters?.search) {
            const lower = filters.search.toLowerCase();
            all = all.filter(r =>
                r.userEmail?.toLowerCase().includes(lower) ||
                r.userName?.toLowerCase().includes(lower)
            );
        }

        // Sort by date desc
        all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return { data: all, count: all.length };
    },

    updateStatus: async (id: string, type: 'contact' | 'demo', status: string, response?: string) => {
        const table = type === 'contact' ? 'contact_requests' : 'demo_requests';
        const payload: any = { status, updated_at: new Date().toISOString() };

        if (type === 'contact' && response) {
            payload.admin_response = response;
        }
        if (type === 'demo' && response) {
            payload.admin_notes = response;
        }

        const { error } = await supabase
            .from(table)
            .update(payload)
            .eq('id', id);

        if (error) throw error;
    }
};
