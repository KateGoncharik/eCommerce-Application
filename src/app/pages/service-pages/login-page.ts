import { Page } from '@templates/page';
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
    const blockName = el('.name-input');
    const blockPassword = el('.password-input');
    const emailInput = el('input', {
      class: 'input__registration-name',
      type: 'text',
      placeholder: 'login or email',
    });
    const passwordInput = el('input', {
      class: 'input__registration-password',
      type: 'password',
      placeholder: 'password',
    });

    mount(inputsBlock, blockName);
    mount(inputsBlock, blockPassword);
    mount(blockName, emailInput);
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
