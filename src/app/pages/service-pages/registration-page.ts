import { Page } from '@templates/page';
import { el, mount } from 'redom';

class RegistrationPage extends Page {
  protected textObject = {
    title: 'Registration page',
  };

  private createForm(): HTMLElement {
    const blockForm = el('.block-form');
    const form = el('.form');
    const blockInput = this.createInput();

    mount(blockForm, form);
    mount(form, blockInput);
    return blockForm;
  }

  private createInput(): HTMLElement {
    const blockInput = el('.blockInput');
    const blockName = el('.form__input-name');
    const blockPassword = el('.form__input-password');
    const emailInput = el('input', { class: 'input__registration-name', type: 'text', placeholder: 'name' });
    const passwordInput = el('input', {
      class: 'input__registration-password',
      type: 'password',
      placeholder: 'password',
    });

    mount(blockInput, blockName);
    mount(blockInput, blockPassword);
    mount(blockName, emailInput);
    mount(blockPassword, passwordInput);
    return blockInput;
  }
  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const form = this.createForm();

    mount(wrapper, form);
    return wrapper;
  }
}

export { RegistrationPage };
