
import { z } from 'zod';

export const competitionSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, { message: 'Slug must only contain lowercase letters, numbers, and hyphens' }),
    season: z.string().min(1, { message: 'Season is required' }),
    exam_date: z.date(),
    exam_window_start: z.date(),
    exam_window_end: z.date(),
    status: z.enum(['draft', 'published', 'upcoming', 'ongoing', 'completed', 'archived', 'open', 'closed', 'live']).default('draft'),
    description: z.string().optional(),
    registration_start_date: z.date(),
    registration_end_date: z.date(),

    enrollment_fee: z.number().min(0, { message: 'Fee cannot be negative' }).default(0),

    // Grade range
    min_grade: z.number().min(1).max(12).default(0),
    max_grade: z.number().min(1).max(12).default(8),

    // Settings
    duration: z.number().min(1, { message: 'Duration is required' }).default(60),
    total_marks: z.number().min(1, 'Total marks is required').default(100),
    total_questions: z.number().min(1, { message: 'Total questions is required' }).default(50),

    // Syllabus
    syllabus: z.array(z.object({
        topic: z.string().min(1, 'Topic is required'),
        description: z.string().optional(),
    })).optional(),

    // Prizes
    prizes: z.array(z.object({
        rank: z.number().min(1),
        title: z.string().min(1, 'Prize title is required'),
        description: z.string().optional(),
        cash_prize: z.number().min(0).optional(),
        worth: z.number().min(0).optional(),
        prize_type: z.enum(['trophy', 'medal', 'certificate', 'cash']).default('medal'),
    })).optional(),
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;
