import { z } from "zod";

const optionalText = z.string().trim().max(120).optional().nullable();

export const signInSchema = z.object({ email: z.email().toLowerCase(), password: z.string().min(8).max(128) });

export const vehicleInputSchema = z.object({
  year: z.coerce.number().int().min(1886).max(new Date().getFullYear() + 2),
  make: z.string().trim().min(1, "Make is required").max(60),
  model: z.string().trim().min(1, "Model is required").max(80),
  nickname: optionalText,
  vin: z.union([z.literal(""), z.string().trim().length(17)]).optional().nullable(),
  imageUrl: z.union([z.literal(""), z.url()]).optional().nullable(),
  isFavorite: z.boolean().optional()
});

export const profileInputSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  phone: optionalText,
  city: optionalText,
  state: z.string().trim().max(2).optional().nullable(),
  notifications: z.object({ emailEnabled: z.boolean(), smsEnabled: z.boolean(), eventReminders: z.boolean(), marketingEnabled: z.boolean() })
});

export type VehicleInput = z.infer<typeof vehicleInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
