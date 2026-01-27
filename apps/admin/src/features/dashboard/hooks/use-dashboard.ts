
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';

export function useDashboardData() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardService.getDashboardData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
