
import { z } from 'zod';

export const questionBankSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().optional(),
    minGrade: z.number().min(1).max(12),
    maxGrade: z.number().min(1).max(12),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
}).refine(data => data.minGrade <= data.maxGrade, {
    message: "Min grade cannot be greater than max grade",
    path: ["minGrade"]
});

export type QuestionBankFormValues = z.infer<typeof questionBankSchema>;
