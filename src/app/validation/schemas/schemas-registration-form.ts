import { z } from 'zod';
import { safeQuerySelector } from '@helpers/safe-query-selector';

function checkValidationPostCode(element: HTMLInputElement, val: string, ctx: z.RefinementCtx): void {
  if (element.value === 'United States') {
    if (!/^[0-9]{5}([- /]?[0-9]{4})?$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'United States Postcode required',
      });
    }
  }
  if (element.value === 'Germany') {
    if (!/(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Germany Postcode required',
      });
    }
  }

  if (element.value === 'Australia') {
    if (!/^(?:(?:[2-8]\d|9[0-7]|0?[28]|0?9(?=09))(?:\d{2}))$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Australia Postcode required',
      });
    }
  }

  if (element.value === 'Spain') {
    if (!/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Spain Postcode required',
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
    .superRefine((val, ctx) => {
      const inputCountryCodeShipping = safeQuerySelector('.country-code-input-shipping');
      const inputCountryCodeBilling = safeQuerySelector('.country-code-input-billing');
      const inputPCBilling = safeQuerySelector('.postal-code-input-billing');
      const inputPCShipping = safeQuerySelector('.postal-code-input-shipping');

      if (
        !(inputCountryCodeShipping instanceof HTMLInputElement) ||
        !(inputCountryCodeBilling instanceof HTMLInputElement)
      ) {
        return;
      }
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
    // .regex(/^(\d{5}|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/, 'Postal code must follow the format for the country')
    .optional(),

  country: z
    .enum(['Germany', 'United States', 'Australia', 'Spain'], {
      errorMap: () => ({
        message: 'Enter the correct country code from this list: Germany | United States | Australia | Spain',
      }),
    })
    .optional(),
});

export type Schemas = z.infer<typeof Schemas>;
export type dataValue = Record<string, string>;
