import { z } from 'zod';

export const reportTypeSchema = z.enum(['move_in', 'move_out', 'maintenance']);
export const reportStatusSchema = z.enum(['draft', 'completed', 'exported']);

export const reportSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  user_id: z.string().uuid(),
  report_type: reportTypeSchema,
  status: reportStatusSchema.default('draft'),
  completed_at: z.string().datetime().nullable(),
  pdf_url: z.string().nullable(),
  share_token: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

export const createReportSchema = z.object({
  property_id: z.string().uuid('Select a property'),
  report_type: reportTypeSchema,
});

export type Report = z.infer<typeof reportSchema>;
export type CreateReport = z.infer<typeof createReportSchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type ReportStatus = z.infer<typeof reportStatusSchema>;
