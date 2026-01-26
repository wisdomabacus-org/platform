import { useQuery } from '@tanstack/react-query';
import { competitionsService } from '@/services/competitions.service';
import type { CompetitionListQuery } from '@/types/competition';

// ==========================================
// Public Competition Hooks
// ==========================================
export function useFeaturedCompetition() {
  return useQuery({
    queryKey: ['competition', 'featured'],
    queryFn: competitionsService.getFeatured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePublicCompetitions(filters: Partial<CompetitionListQuery> = {}) {
  return useQuery({
    queryKey: ['competitions', 'public', filters],
    queryFn: () => competitionsService.getAllPublic(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCompetition(id: string) {
  return useQuery({
    queryKey: ['competition', id],
    queryFn: () => competitionsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompetitionResults(competitionId: string) {
  return useQuery({
    queryKey: ['competition', competitionId, 'results'],
    queryFn: () => competitionsService.getResults(competitionId),
    enabled: !!competitionId,
    retry: false,
  });
}

// ==========================================
// Authenticated Competition Hooks
// ==========================================
export function useMyCompetitions() {
  return useQuery({
    queryKey: ['competitions', 'my'],
    queryFn: () => competitionsService.getMyCompetitions(),
    staleTime: 0, // Always fresh for user dashboard to reflect enrollment changes immediately
  });
}

export function useEnrollmentStatus(competitionId: string) {
  return useQuery({
    queryKey: ['enrollment-status', competitionId],
    queryFn: () => competitionsService.checkEnrollment(competitionId),
    enabled: !!competitionId,
    retry: 1,
  });
}
