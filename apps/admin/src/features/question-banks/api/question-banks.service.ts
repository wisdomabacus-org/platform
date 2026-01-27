
import { supabase } from '@/lib/supabase';
import { QuestionBank, Question } from '../types/question-bank.types';

export const questionBanksService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('question_banks')
            .select('*, questions:questions(count)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            minGrade: item.min_grade,
            maxGrade: item.max_grade,
            tags: item.tags || [],
            isActive: item.is_active,
            questionsCount: item.questions ? item.questions[0]?.count : 0,
            usageCount: item.usage_count || 0,
            createdAt: new Date(item.created_at || new Date().toISOString()),
        })) as QuestionBank[];
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
            questionsCount: 0,
            usageCount: data.usage_count || 0,
            createdAt: new Date(data.created_at || new Date().toISOString()),
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
            .order('created_at', { ascending: true });

        if (error) throw error;

        return data.map((q: any) => ({
            id: q.id,
            bankId: q.question_bank_id,
            text: q.question_text,
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
            createdAt: new Date(q.created_at || new Date().toISOString())
        }));
    },

    createQuestion: async (bankId: string, question: any) => {
        // 1. Create Question
        const payload = {
            question_bank_id: bankId,
            question_text: question.text,
            image_url: question.imageUrl,
            marks: question.marks,
            correct_option_index: question.correctOptionIndex,
        };

        const { data: qData, error: qError } = await supabase
            .from('questions')
            .insert(payload)
            .select()
            .single();

        if (qError) throw qError;
        const questionId = qData.id;

        // 2. Create Options
        const optionsPayload = question.options.map((opt: any, index: number) => ({
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

        return qData;
    },

    updateQuestion: async (id: string, question: any) => {
        // 1. Update Question details
        const payload: any = {
            question_text: question.text,
            image_url: question.imageUrl,
            marks: question.marks,
            correct_option_index: question.correctOptionIndex,
        };

        const { data: qData, error: qError } = await supabase
            .from('questions')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (qError) throw qError;

        // 2. Refresh Options (Delete all and Re-create is simplest for now)
        // Alternatively, upsert if we tracked IDs, but we re-generate on frontend usually
        await supabase.from('question_options').delete().eq('question_id', id);

        const optionsPayload = question.options.map((opt: any, index: number) => ({
            question_id: id,
            text: opt.text,
            option_index: index
        }));

        const { error: oError } = await supabase
            .from('question_options')
            .insert(optionsPayload);

        if (oError) throw oError;

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

    bulkCreateQuestions: async (bankId: string, questions: any[]) => {
        const results = [];
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
