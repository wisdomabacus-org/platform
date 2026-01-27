
import { z } from 'zod';

export const mockTestSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().optional(),
    gradeLevel: z.number().min(1).max(12),
    durationMinutes: z.number().min(5),
    isFree: z.boolean().default(false),
    isPublished: z.boolean().default(false),
    tags: z.array(z.string()).optional(),

    // Question bank assignments could be handled in step 2, or here if simplified
});

export type MockTestFormValues = z.infer<typeof mockTestSchema>;
