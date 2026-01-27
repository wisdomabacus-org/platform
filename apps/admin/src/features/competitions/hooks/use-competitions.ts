
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionsService } from '../api/competitions.service';
import { CompetitionFilters, CompetitionInsert, CompetitionUpdate } from '../types/competition.types';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';

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
            toast.success('Competition created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create competition');
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
            toast.success('Competition updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update competition');
        },
    });
}

export function useDeleteCompetition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => competitionsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPETITIONS] });
            toast.success('Competition deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete competition');
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
            toast.success('Syllabus updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update syllabus');
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
            toast.success('Prizes updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update prizes');
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
            toast.success('Question banks assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to assign question banks');
        },
    });
}
