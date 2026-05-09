import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(128, 'Too long'),
});

export const profileEditSchema = z.object({
  first_name: z.string().max(80).optional(),
  last_name: z.string().max(80).optional(),
  phone_number: z
    .string()
    .max(32)
    .optional()
    .refine(
      (v) => !v || /^[+()\d\s-]{4,32}$/.test(v),
      'Enter a valid phone number',
    ),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileEditValues = z.infer<typeof profileEditSchema>;
