import { z } from 'zod';

const dateSchema = z.string().refine(val => !isNaN(Date.parse(val)), {
  message: 'Invalid date string format'
});

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start: dateSchema,
  end: dateSchema,
  type: z.enum(['task', 'meeting', 'personal']).optional()
});
