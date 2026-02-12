import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBanksService } from '../api/question-banks.service';
import { QUERY_KEYS } from '@/config/constants';
import { QuestionBankFilters } from '../types/question-bank.types';
import { handleMutationError, handleMutationSuccess } from '@/lib/error-handler';

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
            handleMutationSuccess('Question bank created successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to create question bank',
                context: 'Create Question Bank',
            });
        }
    });
}

export function useUpdateQuestionBank() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => questionBanksService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            handleMutationSuccess('Question bank updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update question bank',
                context: 'Update Question Bank',
            });
        }
    });
}

export function useDeleteQuestionBank() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: questionBanksService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            handleMutationSuccess('Question bank deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete question bank',
                context: 'Delete Question Bank',
            });
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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION_BANKS] });
            handleMutationSuccess('Question added successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to add question',
                context: 'Add Question',
            });
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
            handleMutationSuccess('Question updated successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to update question',
                context: 'Update Question',
            });
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
            handleMutationSuccess('Question deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete question',
                context: 'Delete Question',
            });
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
            handleMutationSuccess('Questions imported successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to import questions',
                context: 'Import Questions',
            });
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
            handleMutationSuccess('Questions deleted successfully');
        },
        onError: (error) => {
            handleMutationError(error, {
                fallbackMessage: 'Failed to delete questions',
                context: 'Delete Questions',
            });
        }
    });
}
