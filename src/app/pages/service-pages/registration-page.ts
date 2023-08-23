import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { ValidationForm } from '@validation/validation-registration-form';
import successful from '@icons/successful-ок.png';

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
    const SuccessfulBlock = this.createSuccessfulBlock();

    mount(blockForm, SuccessfulBlock);
    mount(blockForm, form);
    mount(form, title);
    mount(form, blockInput);
    mount(form, blockButton);
    return blockForm;
  }

  private createInput(): HTMLElement {
    const useShipping = el('input#use-shipping-for-billing.checkbox-reg', { type: 'checkbox' });
    const passwordVisibility = el('input.password-checkbox', { type: 'checkbox' });
    const passwordInput =  el('input.password-input.input', { type: 'password', placeholder: 'password', data: 'password' });
    
    const blockInputsRegistration = el('.registration-inputs-block', [
      el('.input-block', [
        el('input.email-input.input', { type: 'text', placeholder: 'email', data: 'email' }),
        el('.show-validation-email-input show-validation'),
      ]),
      el('.input-block', [
        passwordInput,
        el('.show-validation-password-input show-validation'),
        el('.password-visability-block', 'Show password', [
          passwordVisibility,
          el('.show-validation-password-input show-validation')
        ]),
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
              el('input.country-code-input-shipping.input.input-shipping', {
                type: 'text',
                placeholder: 'country',
                data: 'country',
              }),
              el('.show-validation-country-code-input show-validation'),
            ]),
            el('.input-block', [
              el('input.postal-code-input-shipping.input.input-shipping', {
                type: 'text',
                placeholder: 'postal code',
                data: 'postalCode',
              }),
              el('.show-validation-postal-code-input  show-validation'),
            ]),
            el('.block-shipping-checkbox', [
              el('input#shipping-default-checkbox.checkbox-reg', { type: 'checkbox' }),
              el('label', 'Set shipping as default address', { for: 'shipping-default-checkbox' }),
            ]),
            el('.block-shipping-checkbox', [
              useShipping,
              el('label', 'Use shipping address for billing', { for: 'use-shipping-for-billing' }),
            ]),
          ]),
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
              el('input.country-code-input-billing.input.input-billing', {
                type: 'text',
                placeholder: 'country',
                data: 'country',
              }),
              el('.show-validation-country-code-input show-validation'),
            ]),
            el('.input-block', [
              el('input.postal-code-input-billing.input.input-billing', {
                type: 'text',
                placeholder: 'postal code',
                data: 'postalCode',
              }),
              el('.show-validation-postal-code-input  show-validation'),
            ]),

            el('.block-billing-checkbox', [
              el('input#billing-default-checkbox.checkbox-reg', { type: 'checkbox' }),
              el('label', 'Set billing as default address', { for: 'billing-default-checkbox' }),
            ]),
          ]),
        ]),
      ],
    ]);

    if (!(passwordInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }

    this.validation.eventInput(blockInputsRegistration);
    this.validation.eventCheckBox(blockInputsRegistration, useShipping);

    passwordVisibility.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });

    return blockInputsRegistration;
  }

  private createSuccessfulBlock(): HTMLElement {
    const SuccessfulBlock = el('.successful-block', [
      el('.successful', [
        el('.img-massege', [
          el('img.icon-ssuccessful', {
            src: successful,
            alt: 'icon successful',
          }),
        ]),
        el('p.message', 'You have successfully registered!'),
      ]),
    ]);

    return SuccessfulBlock;
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
