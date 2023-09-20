import { emailSchema, passwordSchema } from '@schemas/login-form-schema';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid, markInputAsValid } from '@helpers/toggle-validation-state';

export class LoginFormValidator {
  public validateInput(input: HTMLInputElement): void {
    if (input.classList.contains('email-input')) {
      const emailErrorBlock = safeQuerySelector('.email-error-block', document);
      const emailValidationResult = emailSchema.safeParse({ email: input.value });
      if (emailValidationResult.success) {
        emailErrorBlock.textContent = '';
        markInputAsValid(input);
      } else {
        const errors = emailValidationResult.error.format();
        markInputAsInvalid(input);
        emailErrorBlock.textContent = `${errors?.email?._errors.join(', ')}`;
      }
    }

    if (input.classList.contains('password-input')) {
      const passwordErrorBlock = safeQuerySelector('.password-error-block', document);
      const passwordValidationResult = passwordSchema.safeParse({ password: input.value });
      if (passwordValidationResult.success) {
        passwordErrorBlock.textContent = '';
        markInputAsValid(input);
      } else {
        const errors = passwordValidationResult.error.format();
        passwordErrorBlock.textContent = `${errors?.password?._errors.join(', ')}`;
        markInputAsInvalid(input);
      }
    }
  }

  public isFormValid(): boolean {
    const inputElements = document.getElementsByClassName('input');
    const inputs = Array.from(inputElements);
    let validInputs = 0;
    inputs.forEach((input) => {
      if (input.classList.contains('valid')) {
        validInputs++;
      }
    });
    return inputs.length === validInputs;
  }
}
