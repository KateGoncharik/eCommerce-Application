import { loginFormSchema } from './../schemas/login-form-schema';

export function isFormValid(): boolean {
  const form = document.forms[0];
  const dataForValidation = { email: form.email.value, password: form.password.value };
  const formSchema = loginFormSchema;
  const emailErrorBlock = document.querySelector('.email-error-block');
  const passwordErrorBlock = document.querySelector('.password-error-block');
  if (!emailErrorBlock || !passwordErrorBlock) {
    return false;
  }

  const validationResult = formSchema.safeParse(dataForValidation);
  if (!validationResult.success) {
    const errors = validationResult.error.format();
    emailErrorBlock.textContent = `${errors?.email?._errors.join(', ')}`;
    passwordErrorBlock.textContent = `${errors?.password?._errors.join(', ')}`;
    return false;
  }
  console.log(validationResult.success);
  emailErrorBlock.textContent = '';
  passwordErrorBlock.textContent = '';
  form.email.style = 'border-color: green';
  form.password.style = 'border-color: green';
  return true;
}
