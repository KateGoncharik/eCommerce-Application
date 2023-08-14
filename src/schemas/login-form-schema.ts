import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Email is incorrect. It must contain a domain name and '@' symbol")
    .trim()
    .regex(/^(?! )[A-Za-z0-9.@]*(?<! )/g),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?! )[A-Za-z0-9]*(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]*(?<! )$/g,
      'Password must contain one uppercase and one lowercase letter, one digit '
    ),
});
