
import { z } from 'zod';

export const generatorSchema = z.object({
    // Operation Constraints
    operators: z.array(z.enum(['addition', 'subtraction', 'multiplication', 'division'])).min(1, 'Select at least one operator'),

    // Complexity
    digits: z.number().min(1).max(5).default(1),
    rows: z.number().min(2).max(15).default(3), // For add/sub
    allowNegative: z.boolean().default(true), // Intermediate negatives

    // Quantity
    count: z.number().min(1).max(100).default(10),
});

export type GeneratorConfig = z.infer<typeof generatorSchema>;
