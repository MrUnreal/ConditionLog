import { z } from 'zod';

export const propertyTypeSchema = z.enum([
  'apartment',
  'house',
  'condo',
  'studio',
  'townhouse',
  'other',
]);

export const propertySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  property_type: propertyTypeSchema.default('apartment'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Use 2-letter state code'),
  zip: z.string().min(5, 'ZIP code is required'),
  unit_number: z.string().nullable(),
  landlord_name: z.string().nullable(),
  landlord_email: z.string().email().nullable().or(z.literal('')),
  lease_start: z.string().nullable(),
  lease_end: z.string().nullable(),
  deposit_amount: z.number().nonnegative().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

export const createPropertySchema = z.object({
  property_type: propertyTypeSchema.default('apartment'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Use 2-letter state code'),
  zip: z.string().min(5, 'ZIP code is required'),
  unit_number: z.string().optional().default(''),
  landlord_name: z.string().optional().default(''),
  landlord_email: z.string().email('Invalid email').optional().or(z.literal('')),
  lease_start: z.string().optional().default(''),
  lease_end: z.string().optional().default(''),
  deposit_amount: z
    .union([
      z.number().nonnegative(),
      z.string().transform((v: string) => (v === '' ? null : Number(v))),
    ])
    .nullable()
    .optional(),
});

export type Property = z.infer<typeof propertySchema>;
export type CreateProperty = z.infer<typeof createPropertySchema>;
export type PropertyType = z.infer<typeof propertyTypeSchema>;
