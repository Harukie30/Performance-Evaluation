import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employeeName: z.string(),
  department: z.string(),
  reviewPeriod: z.string(),
  status: z.enum(['draft', 'submitted', 'completed']),
  lastModified: z.string(),
  finalResult: z.object({
    score: z.number().min(0).max(100),
    comments: z.string(),
    submittedBy: z.string(),
    submittedAt: z.string()
  }).optional()
});

export type ReviewSchema = z.infer<typeof reviewSchema>; 