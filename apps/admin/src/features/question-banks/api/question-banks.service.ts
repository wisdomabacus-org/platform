import { supabase } from '@/lib/supabase';
import { QuestionBank, QuestionBankFilters, Question } from '../types/question-bank.types';

export const questionBanksService = {
    getAll: async (filters: QuestionBankFilters = {}) => {
        const { search, minGrade, maxGrade, isActive, bankType, status, page = 0, limit = 10 } = filters;

        let query = supabase
            .from('question_banks')
            .select('*, questions:questions(count)', { count: 'exact' });

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        if (minGrade !== undefined) {
            query = query.gte('min_grade', minGrade);
        }
        if (maxGrade !== undefined) {
            query = query.lte('max_grade', maxGrade);
        }
        if (isActive !== undefined) {
            query = query.eq('is_active', isActive);
        }
        if (bankType) {
            query = query.eq('bank_type', bankType);
        }
        if (status) {
            query = query.eq('status', status);
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            data: data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                minGrade: item.min_grade,
                maxGrade: item.max_grade,
                tags: item.tags || [],
                isActive: item.is_active,
                bankType: item.bank_type || 'competition',
                status: item.status || 'draft',
                questionsCount: item.questions ? item.questions[0]?.count : 0,
                usageCount: item.usage_count || 0,
                createdAt: new Date(item.created_at || new Date().toISOString()),
                updatedAt: new Date(item.updated_at || new Date().toISOString()),
            })) as QuestionBank[],
            total: count || 0,
            page,
            limit
        };
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('question_banks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            minGrade: data.min_grade,
            maxGrade: data.max_grade,
            tags: data.tags || [],
            isActive: data.is_active,
            bankType: data.bank_type || 'competition',
            status: data.status || 'draft',
            questionsCount: 0,
            usageCount: data.usage_count || 0,
            createdAt: new Date(data.created_at || new Date().toISOString()),
            updatedAt: new Date(data.updated_at || new Date().toISOString()),
        } as QuestionBank;
    },

    create: async (bank: Partial<QuestionBank>) => {
        const payload: any = {
            title: bank.title!,
            description: bank.description,
            min_grade: bank.minGrade,
            max_grade: bank.maxGrade,
            tags: bank.tags,
            is_active: bank.isActive,
            bank_type: bank.bankType,
            status: bank.status,
        };

        const { data, error } = await supabase
            .from('question_banks')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async (id: string, updates: Partial<QuestionBank>) => {
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.minGrade !== undefined) payload.min_grade = updates.minGrade;
        if (updates.maxGrade !== undefined) payload.max_grade = updates.maxGrade;
        if (updates.tags !== undefined) payload.tags = updates.tags;
        if (updates.isActive !== undefined) payload.is_active = updates.isActive;
        if (updates.bankType !== undefined) payload.bank_type = updates.bankType;
        if (updates.status !== undefined) payload.status = updates.status;

        const { data, error } = await supabase
            .from('question_banks')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('question_banks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Questions
    getQuestions: async (bankId: string) => {
        const { data, error } = await supabase
            .from('questions')
            .select(`
                *,
                options:question_options(*)
            `)
            .eq('question_bank_id', bankId)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        return data.map((q: any) => ({
            id: q.id,
            bankId: q.question_bank_id,
            text: q.question_text || '', // Legacy
            operations: q.operations || [],
            operatorType: q.operator_type || 'mixed',
            correctAnswer: q.correct_answer || 0,
            digits: q.digits || 1,
            rowsCount: q.rows_count || 0,
            isAutoGenerated: q.is_auto_generated,
            imageUrl: q.image_url,
            // mapping options and sorting by index
            options: (q.options || [])
                .sort((a: any, b: any) => a.option_index - b.option_index)
                .map((o: any) => ({
                    id: o.id,
                    text: o.text,
                    index: o.option_index
                })),
            correctOptionIndex: q.correct_option_index,
            marks: q.marks,
            sortOrder: q.sort_order,
            createdAt: new Date(q.created_at || new Date().toISOString())
        })) as Question[];
    },

    createQuestion: async (bankId: string, question: Partial<Question>) => {
        // 1. Create Question
        const payload = {
            question_bank_id: bankId,
            question_text: question.text || 'Abacus Question', // Fallback or computed
            operations: question.operations || [],
            operator_type: question.operatorType || 'mixed',
            correct_answer: question.correctAnswer || 0,
            digits: question.digits || 1,
            rows_count: question.rowsCount || 2,
            is_auto_generated: question.isAutoGenerated || false,
            image_url: question.imageUrl,
            marks: question.marks || 1,
            correct_option_index: question.correctOptionIndex || 0,
            sort_order: question.sortOrder || 0,
        };

        const { data: qData, error: qError } = await supabase
            .from('questions')
            .insert(payload)
            .select()
            .single();

        if (qError) throw qError;
        const questionId = qData.id;

        // 2. Create Options
        if (question.options && question.options.length > 0) {
            const optionsPayload = question.options.map((opt, index) => ({
                question_id: questionId,
                text: opt.text,
                option_index: index
            }));

            const { error: oError } = await supabase
                .from('question_options')
                .insert(optionsPayload);

            if (oError) {
                // cleanup
                await supabase.from('questions').delete().eq('id', questionId);
                throw oError;
            }
        }

        return qData;
    },

    updateQuestion: async (id: string, question: Partial<Question>) => {
        // 1. Update Question details
        const payload: any = {
            question_text: question.text,
            operations: question.operations,
            operator_type: question.operatorType,
            correct_answer: question.correctAnswer,
            digits: question.digits,
            rows_count: question.rowsCount,
            image_url: question.imageUrl,
            marks: question.marks,
            correct_option_index: question.correctOptionIndex,
            sort_order: question.sortOrder,
        };

        // Remove undefined keys
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data: qData, error: qError } = await supabase
            .from('questions')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (qError) throw qError;

        // 2. Refresh Options if provided
        if (question.options) {
            await supabase.from('question_options').delete().eq('question_id', id);

            const optionsPayload = question.options.map((opt, index) => ({
                question_id: id,
                text: opt.text,
                option_index: index
            }));

            const { error: oError } = await supabase
                .from('question_options')
                .insert(optionsPayload);

            if (oError) throw oError;
        }

        return qData;
    },

    deleteQuestion: async (id: string) => {
        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    bulkCreateQuestions: async (bankId: string, questions: Partial<Question>[]) => {
        const results = [];
        // Sequential to track success/failures clearly
        // Ideally we'd use a transaction or single batch insert if Supabase supported deep inserts easily
        // For now, loop is acceptable for typical batch sizes (10-50 questions)
        for (const q of questions) {
            try {
                await questionBanksService.createQuestion(bankId, q);
                results.push({ success: true });
            } catch (e) {
                console.error("Failed to import question:", q, e);
                results.push({ success: false, error: e });
            }
        }
        return results;
    }
};
