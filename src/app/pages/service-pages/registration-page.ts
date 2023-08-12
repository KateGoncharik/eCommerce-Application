import { Page } from '@templates/page';
import { el, mount } from 'redom';

class RegistrationPage extends Page {
  protected textObject = {
    title: 'Registration page',
  };

  private createForm(): HTMLElement {
    const blockForm = el('.form-block');
    const form = el('.form');
    const blockInput = this.createInput();
    const title = this.title();
    const blockButton = this.createButton();

    mount(blockForm, form);
    mount(form, title);
    mount(form, blockInput);
    mount(form, blockButton);
    return blockForm;
  }

  private createInput(): HTMLElement {
    const blockInput = el('.inputs-block');
    // const blockName = el('.block-input-name');
    // const blockPassword = el('.block-input-password');
    const emailInput = el('input', { class: 'email-input input', type: 'text', placeholder: 'email' });
    const passwordInput = el('input', { class: 'password-input input', type: 'password', placeholder: 'password' });

    mount(blockInput, emailInput);
    mount(blockInput, passwordInput);
    // mount(blockName, nameInput);
    // mount(blockPassword, passwordInput);
    return blockInput;
  }

  protected title(): HTMLElement {
    const blockTitle = el('h2', { class: 'form-title title' });

    blockTitle.textContent = 'Sign up';
    return blockTitle;
  }

  private createButton(): HTMLElement {
    // const blockButton = el('.blockButton');
    const button = el('button', { class: 'form-button btn' });

    button.textContent = 'Join us';

    // mount(blockButton, button);
    return button;
  }

  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const form = this.createForm();

    mount(wrapper, form);
    return wrapper;
  }
}

export { RegistrationPage };
