
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../api/settings.service';
import { toast } from 'sonner';
import { SystemSettings } from '../types/settings.types';

const QUERY_KEY = ['settings'];

export function useSystemSettings() {
    return useQuery({
        queryKey: [...QUERY_KEY, 'system'],
        queryFn: settingsService.getSystemSettings,
    });
}

export function useUpdateSystemSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: Partial<SystemSettings>) => settingsService.updateSystemSettings(settings),
        onSuccess: () => {
            toast.success('Settings updated successfully');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: () => {
            toast.error('Failed to update settings');
        }
    });
}

export function useAdminProfile() {
    return useQuery({
        queryKey: [...QUERY_KEY, 'profile'],
        queryFn: settingsService.getAdminProfile,
    });
}
