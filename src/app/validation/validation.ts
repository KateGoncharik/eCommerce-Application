import { emailSchema, passwordSchema } from '@schemas/login-form-schema';
import { safeQuerySelector } from '@helpers/safe-query-selector';
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
        form.email.classList.remove('invalid');
        form.email.classList.add('valid');

        return;
      } else {
        const errors = emailValidationResult.error.format();
        form.email.style = 'border-color: red';
        form.email.classList.remove('valid');
        form.email.classList.add('invalid');
        emailErrorBlock.textContent = `${errors?.email?._errors.join(', ')}`;
        return;
      }
    }

    if (event.target.classList.contains('password-input')) {
      const passwordValidationResult = passwordSchema.safeParse({ password: form.password.value });
      if (passwordValidationResult.success) {
        passwordErrorBlock.textContent = '';
        form.password.style = 'border-color: green';
        form.password.classList.remove('invalid');
        form.password.classList.add('valid');
        return;
      } else {
        const errors = passwordValidationResult.error.format();
        passwordErrorBlock.textContent = `${errors?.password?._errors.join(', ')}`;
        form.password.style = 'border-color: red';
        form.password.classList.remove('valid');
        form.password.classList.add('invalid');
        return;
      }
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
      inputs.forEach((input) => {
        if (input.innerHTML === '') {
          input.classList.add('invalid');
        }
      });
      return false;
    }
  }
}
