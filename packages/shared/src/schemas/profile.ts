import { z } from 'zod';

export const subscriptionTierSchema = z.enum(['free', 'per_report', 'pro']);

export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  subscription_tier: subscriptionTierSchema.default('free'),
  stripe_customer_id: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createProfileSchema = profileSchema.pick({
  full_name: true,
});

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;
