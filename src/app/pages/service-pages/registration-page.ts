import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { ValidationForm } from '@validation/validation-registration-form';

class RegistrationPage extends Page {
  private validation = new ValidationForm();

  protected textObject = {
    title: 'Registration page',
  };

  private createForm(): HTMLElement {
    const blockForm = el('.registration-form-block');
    const form = el('.registration-form');
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
    const blockInputsRegistration = el('.registration-inputs-block', [
      el('.input-block', [
        el('input.email-input.input', { type: 'text', placeholder: 'email', data: 'email' }),
        el('.show-validation-email-input show-validation'),
      ]),
      el('.input-block', [
        el('input.password-input.input', { type: 'password', placeholder: 'password', data: 'password' }),
        el('.show-validation-password-input show-validation'),
      ]),
      el('.input-block', [
        el('input.first-name-input.input', { type: 'text', placeholder: 'first name', data: 'firstName' }),
        el('.show-validation-first-name-input show-validation'),
      ]),
      el('.input-block', [
        el('input.last-name-input.input', { type: 'text', placeholder: 'last name', data: 'lastName' }),
        el('.show-validation-last-name-input show-validation'),
      ]),
      el('.input-block', [
        el('input.date-input.input', { type: 'date', placeholder: 'date', data: 'dateOfBirth' }),
        el('.show-validation-date-input show-validation'),
      ]),
      [
        el('.block-address', [
          el('.block-billing', [
            el('span.billing', 'Address billing'),
            el('.input-block', [
              el('input.street-input.input.input-billing', { type: 'text', placeholder: 'street', data: 'streetName' }),
              el('.show-validation-street-input show-validation'),
            ]),
            el('.input-block', [
              el('input.city-input.input.input-billing', { type: 'text', placeholder: 'city', data: 'city' }),
              el('.show-validation-city-input show-validation'),
            ]),
            el('.input-block', [
              el('input.postal-code-input.input.input-billing', {
                type: 'text',
                placeholder: 'postal code',
                data: 'postalCode',
              }),
              el('.show-validation-postal-code-input  show-validation'),
            ]),
            el('.input-block', [
              el('input.country-code-input.input.input-billing', {
                type: 'text',
                placeholder: 'country code',
                data: 'country',
              }),
              el('.show-validation-country-code-input show-validation'),
            ]),
            el('.block-billing-checkbox', [
              el('input#billing-checkbox.checkbox-reg', { type: 'checkbox' }),
              el('label', 'Set as default address', { for: 'billing-checkbox' }),
            ]),
          ]),
          el('.block-shipping', [
            el('span.shipping', 'Address shipping'),
            el('.input-block', [
              el('input.street-input.input.input-shipping', {
                type: 'text',
                placeholder: 'street',
                data: 'streetName',
              }),
              el('.show-validation-street-input show-validation'),
            ]),
            el('.input-block', [
              el('input.city-input.input.input-shipping', { type: 'text', placeholder: 'city', data: 'city' }),
              el('.show-validation-city-input show-validation'),
            ]),
            el('.input-block', [
              el('input.postal-code-input.input.input-shipping', {
                type: 'text',
                placeholder: 'postal code',
                data: 'postalCode',
              }),
              el('.show-validation-postal-code-input  show-validation'),
            ]),
            el('.input-block', [
              el('input.country-code-input.input.input-shipping', {
                type: 'text',
                placeholder: 'country code',
                data: 'country',
              }),
              el('.show-validation-country-code-input show-validation'),
            ]),
            el('.block-shipping-checkbox', [
              el('input#shipping-checkbox.checkbox-reg', { type: 'checkbox' }),
              el('label', 'Set as default address', { for: 'shipping-checkbox' }),
            ]),
          ]),
        ]),
      ],
    ]);

    this.validation.eventInput(blockInputsRegistration);

    return blockInputsRegistration;
  }

  protected title(): HTMLElement {
    const blockTitle = el('h2.form-title.title', 'Sign up');
    return blockTitle;
  }

  private createButton(): HTMLElement {
    const button = el('button.form-btn.btn', 'Join us', { type: 'submit' });

    this.validation.checkValidationAllForm(button);

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
