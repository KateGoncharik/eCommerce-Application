import { z } from 'zod';

export const Shemas = z.object({
  email: z.string().email('Enter a valid email').optional(),
  password: z
    .string()
    .regex(/(?=.*\d)/, '')
    .regex(/(?=.*[a-z])/, 'insufficient number of characters in the password')
    .regex(/(?=.*[A-Z])/, 'insufficient AAA of characters in the password')
    .min(8, 'insufficient number of characters in the password')
    .optional(),
});

export type Shemas = z.infer<typeof Shemas>;
export type dataObj = { [key: string]: string };
