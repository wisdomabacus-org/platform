
import { z } from 'zod';

export const mockTestSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
    total_questions: z.coerce.number().min(0).default(0),
    min_grade: z.coerce.number().min(1).max(12),
    max_grade: z.coerce.number().min(1).max(12),
    is_active: z.boolean().default(true),
    is_published: z.boolean().default(false),
    is_locked: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    sort_order: z.coerce.number().default(0),
}).refine(data => data.min_grade <= data.max_grade, {
    message: "Min grade must be less than or equal to max grade",
    path: ["max_grade"]
});

export type MockTestFormValues = z.infer<typeof mockTestSchema>;
