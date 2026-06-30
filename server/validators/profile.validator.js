import { z } from 'zod';

const timeStrSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'Invalid time format (HH:MM)'
});

export const updateProfileSchema = z.object({
  displayName: z.string().optional(),
  workStart: timeStrSchema.optional(),
  workEnd: timeStrSchema.optional(),
  sleepStart: timeStrSchema.optional(),
  sleepEnd: timeStrSchema.optional(),
  classes: z.array(z.object({
    name: z.string(),
    days: z.array(z.number().min(0).max(6)),
    start: timeStrSchema,
    end: timeStrSchema
  })).optional(),
  habits: z.object({
    avgCompletionSpeed: z.number().positive().optional(),
    delayRatio: z.number().min(0).max(1).optional()
  }).optional()
});
