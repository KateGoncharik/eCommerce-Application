import { emailSchema } from '../../schemas/login-form-schema';
import { passwordSchema } from '../../schemas/login-form-schema';

export function validateForm(event: Event): void {
  const form = document.forms[0];
  const emailErrorBlock = document.querySelector('.email-error-block');
  const passwordErrorBlock = document.querySelector('.password-error-block');
  if (!emailErrorBlock || !passwordErrorBlock) {
    throw new Error('error block not found');
  }

  if (!(event.target instanceof HTMLInputElement)) {
    throw new Error('HTMLInputElement expected');
  }

  if (event.target.classList.contains('email-input')) {
    const emailValidationResult = emailSchema.safeParse({ email: form.email.value });
    if (emailValidationResult.success) {
      emailErrorBlock.textContent = '';
      form.email.style = 'border-color: green';
      return;
    } else {
      const errors = emailValidationResult.error.format();
      form.email.style = 'border-color: red';
      emailErrorBlock.textContent = `${errors?.email?._errors.join(', ')}`;
      return;
    }
  }

  if (event.target.classList.contains('password-input')) {
    const passwordValidationResult = passwordSchema.safeParse({ password: form.password.value });
    if (passwordValidationResult.success) {
      passwordErrorBlock.textContent = '';
      form.password.style = 'border-color: green';
      return;
    } else {
      const errors = passwordValidationResult.error.format();
      passwordErrorBlock.textContent = `${errors?.password?._errors.join(', ')}`;
      form.password.style = 'border-color: red';
      return;
    }
  }

  return;
}
