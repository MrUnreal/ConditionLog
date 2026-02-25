import { z } from 'zod';

export const roomTypeSchema = z.enum([
  'kitchen',
  'bathroom',
  'bedroom',
  'living_room',
  'dining_room',
  'entry',
  'hallway',
  'closet',
  'garage',
  'patio',
  'balcony',
  'laundry',
  'basement',
  'attic',
  'office',
  'other',
]);

export const roomSchema = z.object({
  id: z.string().uuid(),
  report_id: z.string().uuid(),
  room_type: roomTypeSchema,
  room_label: z.string().nullable(),
  sort_order: z.number().int().default(0),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createRoomSchema = z.object({
  report_id: z.string().uuid(),
  room_type: roomTypeSchema,
  room_label: z.string().optional().default(''),
  sort_order: z.number().int().optional().default(0),
});

export const updateRoomSchema = z.object({
  room_label: z.string().optional(),
  sort_order: z.number().int().optional(),
  notes: z.string().optional(),
});

export type Room = z.infer<typeof roomSchema>;
export type CreateRoom = z.infer<typeof createRoomSchema>;
export type UpdateRoom = z.infer<typeof updateRoomSchema>;
export type RoomType = z.infer<typeof roomTypeSchema>;
