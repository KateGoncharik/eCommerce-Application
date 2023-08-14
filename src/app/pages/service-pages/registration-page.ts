import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { ValidationForm } from '../../validation-registration-form';

class RegistrationPage extends Page {
  validation = new ValidationForm();

  protected textObject = {
    title: 'Registration page',
  };

  private createForm(): HTMLElement {
    const blockForm = el('.registration-form-block');
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
    const blockInput = el('.input-block');
    const emailInput = el('input', { class: 'email-input input', type: 'text', placeholder: 'email' });
    const passwordInput = el('input', { class: 'password-input input', type: 'password', placeholder: 'password' });
    const firstNameInput = el('input', { class: 'first-nameInput input', type: 'text', placeholder: 'first name' });
    const lastNameInput = el('input', { class: 'last-nameInput input', type: 'text', placeholder: 'last name' });
    const dateOfBirthInput = el('input', { class: 'date-input input', type: 'date', placeholder: 'date' });
    const streetInput = el('input', { class: 'street-input input', type: 'text', placeholder: 'street' });
    const cityInput = el('input', { class: 'city-input input', type: 'text', placeholder: 'city' });
    const postalCodeInput = el('input', { class: 'postal-code-input input', type: 'text', placeholder: 'postal code' });
    const countryInput = el('input', { class: 'country-code-input input', type: 'text', placeholder: 'country' });

    mount(blockInput, emailInput);
    mount(blockInput, passwordInput);
    mount(blockInput, firstNameInput);
    mount(blockInput, lastNameInput);
    mount(blockInput, dateOfBirthInput);
    mount(blockInput, streetInput);
    mount(blockInput, cityInput);
    mount(blockInput, postalCodeInput);
    mount(blockInput, countryInput);

    this.validation.eventInput(blockInput);

    return blockInput;
  }

  protected title(): HTMLElement {
    const blockTitle = el('h2', { class: 'form-title title' });

    blockTitle.textContent = 'Sign up';
    return blockTitle;
  }

  private createButton(): HTMLElement {
    const button = el('button', { class: 'form-button btn' });
    button.textContent = 'Join us';
    return button;
  }

  protected build(): HTMLElement {
    const wrapper = el('.registration-form-wrapper');
    const form = this.createForm();

    mount(wrapper, form);
    return wrapper;
  }
}

export { RegistrationPage };
