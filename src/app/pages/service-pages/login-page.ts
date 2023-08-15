import { Page } from '@app/templates/page';
import { el, mount } from 'redom';

class LoginPage extends Page {
  protected textObject = {
    title: 'Login page',
  };
  private createForm(): HTMLDivElement {
    const formWrapper = el('div');
    const formBlock = el('.form-block');
    const form = el('.form');
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
    const headerBlock = el('h2', { class: 'form-header' });
    headerBlock.textContent = 'Sign in';
    return headerBlock;
  }

  private createInputs(): HTMLElement {
    const inputsBlock = el('.inputs-block');
    const blockEmail = el('.login-input-block');
    const blockPassword = el('.login-input-block');
    const emailInput = el('input', {
      class: 'login-input',
      type: 'text',
      placeholder: 'email',
    });
    const passwordInput = el('input', {
      class: 'login-input',
      type: 'password',
      placeholder: 'password',
    });

    mount(inputsBlock, blockEmail);
    mount(inputsBlock, blockPassword);
    mount(blockEmail, emailInput);
    mount(blockPassword, passwordInput);
    return inputsBlock;
  }

  private createButton(): HTMLElement {
    const button = el('button', { class: 'form-button' });

    button.textContent = 'Continue';
    return button;
  }

  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const form = this.createForm();

    mount(wrapper, form);
    return wrapper;
  }
}

export { LoginPage };
