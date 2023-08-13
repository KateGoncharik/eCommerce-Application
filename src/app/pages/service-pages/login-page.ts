import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { z } from 'zod';

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

  protected isFormValid(userData: { name: string; email: string }): boolean {
    const formSchema = z.object({
      email: z.string().email('Email is incorrect').trim().includes('@'),
      password: z.string().min(8).trim(),
    });
    const validationResult = formSchema.safeParse(userData);
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      console.log(errors);
    }
    return true;
  }

  protected build(): HTMLElement {
    const wrapper = el('.form-wrapper');
    const form = this.createForm();
    this.isFormValid({ name: '1', email: 'wmm@ww.sds' });
    mount(wrapper, form);
    return wrapper;
  }
}

export { LoginPage };
