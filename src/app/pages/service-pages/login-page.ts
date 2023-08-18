import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { formValidation } from '@validation/validation';
import { authorize } from '@app/sdk/requests';
import { safeQuerySelector } from '@helpers/safe-query-selector';

class LoginPage extends Page {
  private validation = new formValidation();

  protected textObject = {
    title: 'Login page',
  };

  protected createHeader(): HTMLHeadingElement {
    const headerBlock = el('h2.form-header');
    if (!(headerBlock instanceof HTMLHeadingElement)) {
      throw new Error('HTMLHeadingElement expected');
    }
    headerBlock.textContent = 'Sign in';
    return headerBlock;
  }

  private createInputs(): HTMLElement {
    const inputsBlock = el('.inputs-block');
    const blockEmail = el('.login-input-block');
    const blockPassword = el('.login-input-block');
    const passwordVisibilityBlock = el('.password-visability-block', 'Show password');
    const emailErrorBlock = el('.error-block.email-error-block');
    const passwordErrorBlock = el('.error-block.password-error-block');
    const emailInput = el('input.email-input.input', {
      name: 'email',
      type: 'text',
      placeholder: 'email',
    });
    const passwordInput = el('input.password-input.input', {
      name: 'password',
      type: 'password',
      placeholder: 'password',
    });
    if (!(passwordInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    const passwordVisibility = el('input.password-checkbox', { type: 'checkbox' });
    passwordVisibility.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });

    mount(inputsBlock, blockEmail);
    mount(inputsBlock, blockPassword);
    mount(blockEmail, emailInput);
    mount(blockEmail, emailErrorBlock);
    mount(blockPassword, passwordInput);
    mount(passwordVisibilityBlock, passwordVisibility);
    mount(blockPassword, passwordErrorBlock);
    mount(blockPassword, passwordVisibilityBlock);
    return inputsBlock;
  }

  private createButton(): HTMLElement {
    const button = el('button.form-button', 'Continue', { type: 'submit' });
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', (event) => {
      event.preventDefault();
      this.validation.isFormValid().then(() => {
        const emailInput = safeQuerySelector('.email-input', document);
        if (!(emailInput instanceof HTMLInputElement)) {
          throw new Error('Button expected');
        }
        const passwordInput = safeQuerySelector('.password-input', document);
        if (!(passwordInput instanceof HTMLInputElement)) {
          throw new Error('Button expected');
        }

        authorize(emailInput.value, passwordInput.value);
      });
    });
    return button;
  }

  private createForm(): HTMLDivElement {
    const formWrapper = el('div');
    const formBlock = el('.form-block');
    const form = el('form.form', { name: 'login' });
    form.addEventListener('input', (event) => this.validation.validateForm(event));
    const inputs = this.createInputs();
    const buttonBlock = this.createButton();
    const header = this.createHeader();

    mount(formWrapper, formBlock);
    mount(formBlock, form);
    mount(form, header);
    mount(form, inputs);
    mount(form, buttonBlock);
    return formWrapper;
  }

  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const formBlock = this.createForm();
    mount(wrapper, formBlock);
    return wrapper;
  }
}

export { LoginPage };
