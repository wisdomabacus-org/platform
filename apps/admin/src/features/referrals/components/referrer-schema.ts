
import { z } from 'zod';

export const referrerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    code: z.string().min(3, 'Code must be at least 3 characters'),
    status: z.enum(['active', 'inactive']).default('active'),
});

export type ReferrerFormValues = z.infer<typeof referrerSchema>;
