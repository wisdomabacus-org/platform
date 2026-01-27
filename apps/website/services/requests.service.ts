/**
 * Requests Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with direct Supabase inserts.
 */

import { createClient } from '@/lib/supabase/client';
import {
    mapDemoRequestToDb,
    mapContactRequestToDb,
} from '@/lib/supabase/entity-mappers';
import type { DemoRequest, ContactRequest, RequestResponse } from '@/types/request';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
    return createClient();
}

export const requestsService = {
    /**
     * Submit Demo Request
     * Inserts into demo_requests table
     */
    submitDemoRequest: async (payload: DemoRequest): Promise<RequestResponse> => {
        const supabase = getSupabaseClient();

        // Map to database format
        const dbPayload = mapDemoRequestToDb({
            ...payload,
            message: undefined, // DemoRequest doesn't have message in frontend
        });

        const { data, error } = await supabase
            .from('demo_requests')
            .insert(dbPayload)
            .select('id')
            .single();

        if (error) {
            throw new Error(`Failed to submit demo request: ${error.message}`);
        }

        return {
            message: 'Demo request submitted successfully! We will contact you shortly.',
            requestId: data.id,
        };
    },

    /**
     * Submit Contact Request
     * Inserts into contact_requests table
     */
    submitContactRequest: async (payload: ContactRequest): Promise<RequestResponse> => {
        const supabase = getSupabaseClient();

        // Map to database format
        const dbPayload = mapContactRequestToDb(payload);

        const { data, error } = await supabase
            .from('contact_requests')
            .insert(dbPayload)
            .select('id')
            .single();

        if (error) {
            throw new Error(`Failed to submit contact request: ${error.message}`);
        }

        return {
            message: 'Thank you for contacting us! We will get back to you soon.',
            requestId: data.id,
        };
    },
};
