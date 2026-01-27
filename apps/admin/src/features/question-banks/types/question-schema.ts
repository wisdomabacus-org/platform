
import { z } from 'zod';

export const questionOptionSchema = z.object({
    text: z.string().min(1, 'Option text is required'),
});

export const questionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    imageUrl: z.string().optional(),
    marks: z.number().min(1),
    options: z.array(questionOptionSchema).min(2, 'At least 2 options are required'),
    correctOptionIndex: z.number().min(0).max(5), // limiting to 6 options max
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
