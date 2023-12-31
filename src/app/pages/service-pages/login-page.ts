import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { renderHeader } from '@helpers/render-header';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { authorizeUser } from '@app/sdk/requests';
import { LoginFormValidator } from '@validation/login-form-validator';
import { router, redirect } from '@app/router';
import { Route } from '@customTypes/route';

class LoginPage extends Page {
  private loginFormValidator = new LoginFormValidator();

  protected textObject = {
    title: 'Login page',
  };

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
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const inputElements = document.getElementsByClassName('input');
      const inputs = Array.from(inputElements);
      inputs.forEach((input) => {
        if (!(input instanceof HTMLInputElement)) {
          throw new Error('HTMLInputElement expected');
        }
        this.loginFormValidator.validateInput(input);
      });

      if (!this.loginFormValidator.isFormValid()) {
        return;
      }

      const emailInput = safeQuerySelector<HTMLInputElement>('.email-input', document);
      const passwordInput = safeQuerySelector<HTMLInputElement>('.password-input', document);
      const emailErrorBlock = safeQuerySelector<HTMLInputElement>('.email-error-block', document);

      const authError = await authorizeUser(emailInput.value, passwordInput.value);
      emailErrorBlock.textContent = authError ?? '';
      if (!authError) {
        redirect(Route.Main);
        renderHeader();
        router.updatePageLinks();
      }
    });
    return button;
  }

  private createForm(): HTMLDivElement {
    const formWrapper = el('div');
    const formBlock = el('.form-block');
    const form = el('form.form', { name: 'login' });
    form.addEventListener('input', (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        throw new Error('HTMLInputElement expected');
      }
      this.loginFormValidator.validateInput(event.target);
    });
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

  protected createHeader(): HTMLHeadingElement {
    const headerBlock = el('h2.form-header');
    if (!(headerBlock instanceof HTMLHeadingElement)) {
      throw new Error('HTMLHeadingElement expected');
    }
    headerBlock.textContent = 'Sign in';
    return headerBlock;
  }

  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const formBlock = this.createForm();
    mount(wrapper, formBlock);
    return wrapper;
  }
}

export { LoginPage };
