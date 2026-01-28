import { z } from 'zod';

export const questionBankSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().optional(),
    minGrade: z.number().min(0, 'Minimum grade is UKG (0)').max(8, 'Maximum grade is 8'),
    maxGrade: z.number().min(0, 'Minimum grade is UKG (0)').max(8, 'Maximum grade is 8'),
    tags: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
    bankType: z.enum(['competition', 'mock_test']).default('competition'),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
}).refine(data => data.minGrade <= data.maxGrade, {
    message: "Min grade cannot be greater than max grade",
    path: ["minGrade"]
});

export type QuestionBankFormValues = z.infer<typeof questionBankSchema>;
