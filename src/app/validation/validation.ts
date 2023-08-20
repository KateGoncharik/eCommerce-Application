import { emailSchema, passwordSchema } from '@schemas/login-form-schema';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { toggleValidationState } from '@helpers/toggle-validation-state';
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
        toggleValidationState(form.email, 'valid');
      } else {
        const errors = emailValidationResult.error.format();
        toggleValidationState(form.email, 'invalid');
        emailErrorBlock.textContent = `${errors?.email?._errors.join(', ')}`;
      }
      return;
    }

    if (event.target.classList.contains('password-input')) {
      const passwordValidationResult = passwordSchema.safeParse({ password: form.password.value });
      if (passwordValidationResult.success) {
        passwordErrorBlock.textContent = '';
        toggleValidationState(form.password, 'valid');
      } else {
        const errors = passwordValidationResult.error.format();
        passwordErrorBlock.textContent = `${errors?.password?._errors.join(', ')}`;
        toggleValidationState(form.password, 'invalid');
      }
      return;
    }
    return;
  }
  public async isFormValid(): Promise<boolean> {
    const inputElements = document.getElementsByClassName('input');
    const inputs = Array.from(inputElements);
    let validInputs = 0;
    inputs.forEach((input) => {
      if (input.classList.contains('valid')) {
        validInputs++;
      }
    });
    if (inputs.length === validInputs) {
      return true;
    } else {
      return false;
    }
  }
}
