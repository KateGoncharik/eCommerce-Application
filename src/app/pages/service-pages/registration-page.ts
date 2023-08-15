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
    const blockInputsRegistration = 
    el('.registration-inputs-block', [
      el('.input-block', [
        el('input', { class: 'email-input input', type: 'text', placeholder: 'email' }),
        el('.show-validation-email-input show-validation')]),
      el('.input-block', [
        el('input', { class: 'password-input input', type: 'password', placeholder: 'password' }),
        el('.show-validation-password-input show-validation')]), 
      el('.input-block', [
        el('input', { class: 'first-nameInput input', type: 'text', placeholder: 'first name' }),
        el('.show-validation-first-nameInput show-validation')]), 
      el('.input-block', [
        el('input', { class: 'last-nameInput input', type: 'text', placeholder: 'last name' }),
        el('.show-validation-last-nameInput show-validation')]), 
      el('.input-block', [
        el('input', { class: 'date-input input', type: 'date', placeholder: 'date' }),
        el('.show-validation-date-input show-validation')]), 
      el('.input-block', [
        el('input', { class: 'street-input input', type: 'text', placeholder: 'street' }),
        el('.show-validation-street-input show-validation')]), 
      el('.input-block', [
        el('input', { class: 'city-input input', type: 'text', placeholder: 'city' }),
        el('.show-validation-city-input show-validation')]),  
      el('.input-block', [
        el('input', { class: 'postal-code-input input', type: 'text', placeholder: 'postal code' }),
        el('.show-validation-postal-code-input  show-validation')]),
      el('.input-block', [
        el('input', { class: 'country-code-input input', type: 'text', placeholder: 'country' }),
        el('.show-validation-country-code-input show-validation')]), 
    ]);

    this.validation.eventInput(blockInputsRegistration);

    return blockInputsRegistration;
  }

  protected title(): HTMLElement {
    const blockTitle = el('h2', 'Sign up',{ class: 'form-title title' });
    return blockTitle;
  }

  private createButton(): HTMLElement {
    const button = el('button', 'Join us', { type: 'submit', class: 'form-btn btn' });
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
