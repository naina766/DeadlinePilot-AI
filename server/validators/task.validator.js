import { z } from 'zod';

const dateSchema = z.string().refine(val => !isNaN(Date.parse(val)), {
  message: 'Invalid date string format'
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  deadline: dateSchema,
  estimatedHours: z.number().positive().optional().default(1.0),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  deadline: dateSchema.optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().nonnegative().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Overdue']).optional(),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
  calendarEventId: z.string().optional(),
  scheduledStart: dateSchema.nullable().optional(),
  scheduledEnd: dateSchema.nullable().optional(),
  subtasks: z.array(z.object({
    title: z.string(),
    status: z.enum(['pending', 'completed']),
    estimatedHours: z.number().optional()
  })).optional()
});
