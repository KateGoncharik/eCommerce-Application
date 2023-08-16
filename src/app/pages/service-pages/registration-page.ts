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
    const blockInputsRegistration = 
    el('.registration-inputs-block', [
      el('.input-block', [
        el('input.email-input.input', { type: 'text', placeholder: 'email' }),
        el('.show-validation-email-input show-validation')]),
      el('.input-block', [
        el('input.password-input.input', { type: 'password', placeholder: 'password' }),
        el('.show-validation-password-input show-validation')]), 
      el('.input-block', [
        el('input.first-name-input.input', { type: 'text', placeholder: 'first name' }),
        el('.show-validation-first-name-input show-validation')]), 
      el('.input-block', [
        el('input.last-name-input.input', { type: 'text', placeholder: 'last name' }),
        el('.show-validation-last-name-input show-validation')]), 
      el('.input-block', [
        el('input.date-input.input', { type: 'date', placeholder: 'date' }),
        el('.show-validation-date-input show-validation')]), 
      el('.input-block', [
        el('input.street-input.input', { type: 'text', placeholder: 'street' }),
        el('.show-validation-street-input show-validation')]), 
      el('.input-block', [
        el('input.city-input.input', { type: 'text', placeholder: 'city' }),
        el('.show-validation-city-input show-validation')]),  
      el('.input-block', [
        el('input.postal-code-input.input', { type: 'text', placeholder: 'postal code' }),
        el('.show-validation-postal-code-input  show-validation')]),
      el('.input-block', [
        el('input.country-code-input.input', { type: 'text', placeholder: 'country' }),
        el('.show-validation-country-code-input show-validation')]), 
    ]);

    this.validation.eventInput(blockInputsRegistration);

    return blockInputsRegistration;
  }

  protected title(): HTMLElement {
    const blockTitle = el('h2', 'Sign up', { class: 'form-title title' });
    return blockTitle;
  }

  private createButton(): HTMLElement {
    const button = el('button', 'Join us', { class: 'form-btn btn', type: 'submit' });

    this.validation.checkValidationAllForm(button)

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
