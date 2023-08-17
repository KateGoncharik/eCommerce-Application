import { emailSchema, passwordSchema } from '@app/validation/schemas/login-form-schema';
import { safeQuerySelector } from '@app/helpers/safe-query-selector';

export class formValidation {
  public validateForm(event: Event): void {
    const form = document.forms[0];
    const emailErrorBlock = safeQuerySelector('.email-error-block', document);
    const passwordErrorBlock = safeQuerySelector('.password-error-block', document);

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
  public isFormValid(): boolean {
    const inputs = document.getElementsByClassName('input');
    const errorBlocks = document.getElementsByClassName('error-block');

    let inputsWithText = 0;
    let emptyErrorBlocks = 0;

    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      if (input.value) {
        inputsWithText++;
      }
    });
    Array.from(errorBlocks).forEach((errorBlock) => {
      if (errorBlock.innerHTML === '') {
        emptyErrorBlocks++;
      }
    });
    if (inputsWithText === emptyErrorBlocks) {
      return true;
    } else {
      Array.from(errorBlocks).forEach((errorBlock) => {
        errorBlock.textContent = 'This field is required.';
      });
      return false;
    }
  }
}
