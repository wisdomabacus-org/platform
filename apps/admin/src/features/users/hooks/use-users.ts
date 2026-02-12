
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '../api/users.service';
import { UserFilters } from '../types/user.types';
import { QUERY_KEYS } from '@/config/constants';

export function useUsers(filters?: UserFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, filters],
        queryFn: () => usersService.getAll(filters),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, id],
        queryFn: () => usersService.getById(id),
        enabled: !!id,
    });
}

export function useUserEnrollments(userId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, userId, 'enrollments'],
        queryFn: () => usersService.getEnrollments(userId),
        enabled: !!userId,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => usersService.updateProfile(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS, variables.id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    });
}

export function useUserPayments(userId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, userId, 'payments'],
        queryFn: () => usersService.getUserPayments(userId),
        enabled: !!userId,
    });
}

export function useUserMockTestAttempts(userId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, userId, 'mock-test-attempts'],
        queryFn: async () => {
            const { mockTestAttemptsService } = await import('../../mock-tests/api/mock-test-attempts.service');
            return mockTestAttemptsService.getByUser(userId);
        },
        enabled: !!userId,
    });
}

export function useBulkCreateUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (users: any[]) => usersService.bulkCreate(users),
        onSuccess: () => {
            // Invalidate users list
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            toast.success('Users imported successfully');
        },
        onError: (error) => {
            toast.error(`Failed to import users: ${error.message}`);
        }
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) => usersService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            toast.success('User status updated');
        },
        onError: (error) => {
            toast.error(`Failed to update status: ${error.message}`);
        }
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => usersService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete user: ${error.message}`);
        }
    });
}
