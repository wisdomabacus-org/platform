
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBanksService } from '../api/question-banks.service';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';

import { QuestionBankFilters } from '../types/question-bank.types';

export function useQuestionBanks(filters: QuestionBankFilters = {}) {
    return useQuery({
        queryKey: [QUERY_KEYS.QUESTION_BANKS, filters],
        queryFn: () => questionBanksService.getAll(filters),
    });
}

export function useQuestionBank(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.QUESTION_BANKS, id],
        queryFn: () => questionBanksService.getById(id),
        enabled: !!id,
    });
}

export function useCreateQuestionBank() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionBanksService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            toast.success('Question bank created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create question bank');
            console.error(error);
        }
    });
}

export function useUpdateQuestionBank() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => questionBanksService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            toast.success('Question bank updated');
        },
        onError: (error) => {
            toast.error('Failed to update question bank');
            console.error(error);
        }
    });
}

export function useDeleteQuestionBank() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionBanksService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            toast.success('Question bank deleted');
        },
        onError: (error) => {
            toast.error('Failed to delete question bank');
            console.error(error);
        }
    });
}

// Questions Hooks

export function useQuestions(bankId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.QUESTION_BANKS, bankId, 'questions'],
        queryFn: () => questionBanksService.getQuestions(bankId),
        enabled: !!bankId,
    });
}

export function useCreateQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bankId, data }: { bankId: string; data: any }) =>
            questionBanksService.createQuestion(bankId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.QUESTION_BANKS, variables.bankId, 'questions']
            });
            // Also invalidate bank details to update count if needed
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            toast.success('Question added successfully');
        },
        onError: (error) => {
            toast.error('Failed to add question');
            console.error(error);
        }
    });
}

export function useUpdateQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            questionBanksService.updateQuestion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.QUESTION_BANKS]
            });
            toast.success('Question updated');
        },
        onError: (error) => {
            toast.error('Failed to update question');
            console.error(error);
        }
    });
}

export function useDeleteQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionBanksService.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.QUESTION_BANKS]
            });
            toast.success('Question deleted');
        },
        onError: (error) => {
            toast.error('Failed to delete question');
            console.error(error);
        }
    });
}

export function useBulkCreateQuestions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bankId, questions }: { bankId: string; questions: any[] }) =>
            questionBanksService.bulkCreateQuestions(bankId, questions),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.QUESTION_BANKS, variables.bankId, 'questions']
            });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
        },
        onError: (error) => {
            toast.error('Failed to import questions');
            console.error(error);
        }
    });
}

export function useBulkDeleteQuestions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { bankId: string; questionIds: string[] }) =>
            questionBanksService.bulkDeleteQuestions(args.questionIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.QUESTION_BANKS, variables.bankId, 'questions']
            });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
        },
        onError: (error) => {
            toast.error('Failed to delete questions');
            console.error(error);
        }
    });
}
