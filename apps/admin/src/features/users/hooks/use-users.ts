
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
