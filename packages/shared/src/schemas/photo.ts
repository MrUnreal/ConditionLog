import { z } from 'zod';

export const photoSchema = z.object({
  id: z.string().uuid(),
  room_id: z.string().uuid(),
  storage_path: z.string(),
  thumbnail_path: z.string().nullable(),
  caption: z.string().nullable(),
  notes: z.string().nullable(),
  taken_at: z.string().datetime(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  ai_damage_detected: z.boolean().default(false),
  ai_damage_labels: z.unknown().nullable(),
  ai_description: z.string().nullable(),
  sort_order: z.number().int().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createPhotoSchema = z.object({
  room_id: z.string().uuid(),
  storage_path: z.string().min(1),
  thumbnail_path: z.string().nullable().optional(),
  caption: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  taken_at: z.string().datetime(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  sort_order: z.number().int().optional().default(0),
});

export const updatePhotoSchema = z.object({
  caption: z.string().optional(),
  notes: z.string().optional(),
  sort_order: z.number().int().optional(),
});

export type Photo = z.infer<typeof photoSchema>;
export type CreatePhoto = z.infer<typeof createPhotoSchema>;
export type UpdatePhoto = z.infer<typeof updatePhotoSchema>;
