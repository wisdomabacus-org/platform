import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionsService } from '../api/competitions.service';
import { CompetitionFilters, CompetitionInsert, CompetitionUpdate } from '../types/competition.types';
import { QUERY_KEYS } from '@/config/constants';
import { handleMutationError, handleMutationSuccess } from '@/lib/error-handler';

export function useCompetitions(filters?: CompetitionFilters & { page?: number; limit?: number }) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, filters],
        queryFn: () => competitionsService.getAll(filters),
    });
}

export function useCompetition(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, id],
        queryFn: () => competitionsService.getById(id),
        enabled: !!id,
    });
}

export function useCreateCompetition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CompetitionInsert) => competitionsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            handleMutationSuccess('Competition created successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to create competition',
                context: 'Create Competition',
            });
        },
    });
}

export function useUpdateCompetition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CompetitionUpdate }) =>
            competitionsService.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS, data.id] });
            handleMutationSuccess('Competition updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update competition',
                context: 'Update Competition',
            });
        },
    });
}

export function useDeleteCompetition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => competitionsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            handleMutationSuccess('Competition deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete competition',
                context: 'Delete Competition',
            });
        },
    });
}

export function useUpdateCompetitionSyllabus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, topics }: { id: string; topics: any[] }) =>
            competitionsService.updateSyllabus(id, topics),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS, variables.id] });
            handleMutationSuccess('Syllabus updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update syllabus',
                context: 'Update Syllabus',
            });
        },
    });
}

export function useUpdateCompetitionPrizes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, prizes }: { id: string; prizes: any[] }) =>
            competitionsService.updatePrizes(id, prizes),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS, variables.id] });
            handleMutationSuccess('Prizes updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update prizes',
                context: 'Update Prizes',
            });
        },
    });
}

export function useCompetitionQuestionBanks(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, id, 'question-banks'],
        queryFn: () => competitionsService.getQuestionBanks(id),
        enabled: !!id,
    });
}

export function useAssignQuestionBanks() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, assignments }: { id: string; assignments: any[] }) =>
            competitionsService.assignQuestionBanks(id, assignments),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS, variables.id, 'question-banks'] });
            handleMutationSuccess('Question banks assigned successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to assign question banks',
                context: 'Assign Question Banks',
            });
        },
    });
}

// New hook to get competition participants/enrollments
export function useCompetitionParticipants(competitionId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, competitionId, 'participants'],
        queryFn: () => competitionsService.getParticipants(competitionId),
        enabled: !!competitionId,
    });
}

// New hook to get competition revenue statistics
export function useCompetitionRevenue(competitionId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPETITIONS, competitionId, 'revenue'],
        queryFn: () => competitionsService.getRevenueStats(competitionId),
        enabled: !!competitionId,
    });
}
