
import { z } from 'zod';

export const competitionSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, { message: 'Slug must only contain lowercase letters, numbers, and hyphens' }),
    season: z.string().min(1, { message: 'Season is required' }),
    exam_date: z.date(),
    status: z.enum(['draft', 'published', 'upcoming', 'ongoing', 'completed', 'archived']).default('draft'),
    description: z.string().optional(),
    registration_start_date: z.date(),
    registration_end_date: z.date(),

    enrollment_fee: z.number().min(0, { message: 'Fee cannot be negative' }).default(0),

    // Settings
    duration: z.number().min(1, { message: 'Duration is required' }).default(60),
    total_marks: z.number().min(1, 'Total marks is required').default(100),
    total_questions: z.number().min(1, { message: 'Total questions is required' }).default(50),
});

export type CompetitionFormValues = z.infer<typeof competitionSchema>;
