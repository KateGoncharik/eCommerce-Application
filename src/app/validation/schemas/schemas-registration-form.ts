import { z } from 'zod';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { Country } from '@app/types/enums';

function checkValidationPostCode(element: HTMLInputElement, val: string, ctx: z.RefinementCtx): void {
  if (element.value === 'United States') {
    if (!/^[0-9]{5}([- /]?[0-9]{4})?$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid postal code format for United States',
      });
    }
  }
  if (element.value === 'Germany') {
    if (!/^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid postal code format for Germany',
      });
    }
  }

  if (element.value === 'Australia') {
    if (!/^(?:(?:[2-8]\d|9[0-7]|0?[28]|0?9(?=09))(?:\d{2}))$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid postal code format for Australia',
      });
    }
  }

  if (element.value === 'Spain') {
    if (!/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid postal code format for Spain',
      });
    }
  }
}

export const Schemas = z.object({
  email: z.string().email("Email is incorrect. It must contain a domain name and '@' symbol").optional(),

  password: z
    .string()
    .regex(/(?=.*[0-9])/, 'Password must contain at least 1 number')
    .regex(/(?=.*[a-z])/, 'Password must contain at least 1 lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
    .regex(/^[^\s].+[^\s]$/, 'Password must not contain leading or trailing whitespace')
    .min(8, 'Password must be at least 8 characters long')
    .optional(),

  'first name': z
    .string()
    .regex(/^[a-zA-Z]+$/, 'First name must contain at least one character and no special characters or numbers')
    .optional(),

  'last name': z
    .string()
    .regex(/^[a-zA-Z]+$/, 'Last name must contain at least one character and no special characters or numbers')
    .optional(),

  date: z.coerce
    .date()
    .min(new Date(1900, 0, 1), 'Date cannot go past January 1 1920')
    .max(new Date(2010, 0, 1), { message: 'You must be 13 years or older' })
    .optional(),

  street: z.string().regex(/(.)/, 'Street must contain at least one character').optional(),

  city: z
    .string()
    .regex(/^[a-zA-Z]+$/, 'City must contain at least one character and no special characters or numbers')
    .optional(),

  'postal code': z
    .string()
    .superRefine((val:string, ctx: z.RefinementCtx) => {
      const inputCountryCodeShipping = safeQuerySelector<HTMLInputElement>('.country-code-input-shipping');
      const inputCountryCodeBilling = safeQuerySelector<HTMLInputElement>('.country-code-input-billing');
      const inputPCBilling = safeQuerySelector('.postal-code-input-billing');
      const inputPCShipping = safeQuerySelector('.postal-code-input-shipping');

      
      if (inputCountryCodeShipping.classList.contains('active') && inputPCShipping.classList.contains('active')) {
        inputPCShipping.classList.remove('active');
        checkValidationPostCode(inputCountryCodeShipping, val, ctx);
      } else if (inputCountryCodeBilling.classList.contains('active') && inputPCBilling.classList.contains('active')) {
        inputPCBilling.classList.remove('active');
        checkValidationPostCode(inputCountryCodeBilling, val, ctx);
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No country selected',
        });
      }
    })
    .optional(),

  country: z
    .enum([Country.UnitedStates, Country.Germany, Country.Spain, Country.Australia], {
      errorMap: () => ({
        message: `Enter the correct country from this list: 
        ${Country.UnitedStates} | 
        ${Country.Germany} | 
        ${Country.Spain} | 
        ${Country.Australia}`,
      }),
    })
    .optional(),
});

export type Schemas = z.infer<typeof Schemas>;
export type dataValue = Record<string, string>;
