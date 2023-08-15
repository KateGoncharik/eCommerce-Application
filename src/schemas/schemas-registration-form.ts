import { z } from 'zod';

export const Shemas = z.object({
  email: z
    .string()
    .email("Email is incorrect. It must contain a domain name and '@' symbol")
    .optional(),

  password: z
    .string()
    .regex(/(?=.*[0-9])/, 'Password must contain at least 1 number')
    .regex(/(?=.*[a-z])/, 'Password must contain at least 1 lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
    .regex(/^[^\s].+[^\s]$/, 'Password must not contain leading or trailing whitespace')
    .min(8, 'Password must be at least 8 characters long')
    .optional(),

  "first name": z
    .string()
    .regex(/^[a-zA-Z]+$/, 'First name must contain at least one character and no special characters or numbers')
    .optional(),

  "last name": z
    .string()
    .regex(/^[a-zA-Z0-9_]*[a-zA-Z][a-zA-Z0-9_]*$/, 'Last name must contain at least one character and no special characters or numbers')
    .optional(),

  date: z.coerce
    .date()
    .min(new Date(1900, 0, 1), 'Date cannot go past January 1 1920')
    .max(new Date(2010, 0, 1), { message: "You must be 13 years or older" })
    .optional(),

  street: z
    .string()
    .regex(/(.)/, 'Street must contain at least one character')
    .optional(),

  city: z
    .string()
    .regex(/^[a-zA-Z]+$/, 'City must contain at least one character and no special characters or numbers')
    .optional(),

  "postal code": z
    .string()
    .regex(/^(\d{5}|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/, "Postal code must follow the format for the country")
    .optional(),

  country: z
  .string()
    .regex(/^[a-zA-Z]+$/, 'Country must be a valid country')
    .optional(),

});

export type Shemas = z.infer<typeof Shemas>;
export type dataValue =  Record<string, string>;
