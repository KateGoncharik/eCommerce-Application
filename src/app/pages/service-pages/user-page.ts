import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getUserGender, getUser } from '@app/state';
import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';
import { getFullCountryName } from '@helpers/get-full-country-name';
import { ValidationForm } from '@app/validation/validation-registration-form';
import { updateUser } from '@app/sdk/requests';
import { collectAllInputsActions } from '@helpers/get-actions';
import { toggleInputsState } from '@helpers/toggle-inputs-state';
import { toggleSaveButtonState } from '@helpers/toggle-save-button-state';
import { Route } from '@app/types/route';
import { redirect } from '@app/router';

class UserPage extends Page {
  protected textObject = {
    title: 'User page',
  };

  private validation = new ValidationForm();

  private createAvatar(): HTMLElement {
    const userAvatarWrapper = el('.user-avatar-wrapper');
    const userGender = getUserGender();

    const src = this.getAvatarByGender(userGender);
    const userAvatar = el('.avatar-wrapper', [el('img.avatar', { src: src, alt: 'girl' })]);
    mount(userAvatarWrapper, userAvatar);
    return userAvatarWrapper;
  }

  private getAvatarByGender(gender: string): HTMLImageElement {
    return gender === 'male' ? boyAvatar : girlAvatar;
  }

  private createUserInfoBlock(): HTMLElement {
    const user = getUser();
    if (user === null) {
      throw new Error('No user found');
    }
    const useShipping = el('input#use-shipping-for-billing.checkbox-reg', { type: 'checkbox', disabled: true });
    const genderInput = el('input.gender-input.input', {
      type: 'text',
      value: getUserGender(),
      placeholder: 'gender',
      name: 'gender',
      disabled: true,
    });
    if (!(genderInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    genderInput.addEventListener('input', () => {
      this.validation.validateGenderInput(genderInput);
    });
    const infoBlock = el('.user-info-wrapper', [
      el('span.user-info-title', 'User information'),
      this.createAvatar(),
      el('.user-info-block', [
        el('.user-name-block', [
          el('.input-block', [
            el('span.user-info-subtitle', 'First name'),
            el('input.first-name-input.input', {
              type: 'text',
              value: user.firstName,
              placeholder: 'first name',
              data: 'firstName',
              disabled: true,
            }),
            el('.show-validation-first-name-input show-validation'),
          ]),
          el('.input-block', [
            el('span.user-info-subtitle', 'Last name'),
            el('input.last-name-input.input', {
              type: 'text',
              value: user.lastName,
              placeholder: 'last name',
              data: 'lastName',
              disabled: true,
            }),
            el('.show-validation-last-name-input show-validation'),
          ]),
        ]),

        el('.user-date-gender-block', [
          el('.input-block', [
            el('span.user-info-subtitle', 'Birth date'),
            el('input.date-input.input', {
              type: 'text',
              value: user.dateOfBirth,
              placeholder: 'date',
              data: 'dateOfBirth',
              disabled: true,
            }),
            el('.show-validation-date-input show-validation'),
          ]),
          el('.input-gender-block', [el('span.user-info-subtitle', 'Gender'), genderInput]),
          el('.show-validation-gender show-validation'),
        ]),
      ]),
      el('.email-password-block', [
        el('.input-block', [
          el('span.user-info-subtitle', 'Email'),
          el('input.email-input.input', {
            type: 'text',
            value: user.email,
            placeholder: 'email',
            data: 'email',
            disabled: true,
          }),
          el('.show-validation-email-input show-validation'),
        ]),
        el('.input-block', [el('span.user-info-subtitle', 'Password'), this.createEditPasswordButton()]),
      ]),

      el('.user-addresses-block', [
        el('.block-shipping.default', [
          el('span.shipping', 'Address (shipping)'),

          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-input.input.input-shipping', {
              type: 'text',
              value: user.addresses[0].streetName,
              placeholder: 'street',
              data: 'streetName',
              disabled: true,
            }),
            el('.show-validation-street-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-shipping', {
              type: 'text',
              value: user.addresses[0].city,
              placeholder: 'city',
              data: 'city',
              disabled: true,
            }),
            el('.show-validation-city-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-shipping.input.input-shipping.active', {
              type: 'text',
              value: getFullCountryName(user.addresses[0].country),
              placeholder: 'country',
              data: 'country',
              disabled: true,
            }),
            el('.show-validation-country-code-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-shipping.input.input-shipping.active', {
              type: 'text',
              value: user.addresses[0].postalCode,
              placeholder: 'postal code',
              data: 'postalCode',
              disabled: true,
            }),
            el('.show-validation-postal-code-input  show-validation'),
          ]),
          el('.block-shipping-checkbox', [
            el('input#shipping-default-checkbox.checkbox-reg', { type: 'checkbox', disabled: true }),
            el('label', 'Set shipping as default address', { for: 'shipping-default-checkbox' }),
          ]),
          el('.block-shipping-checkbox', [
            useShipping,
            el('label', 'Use shipping address for billing', { for: 'use-shipping-for-billing' }),
          ]),
        ]),
        el('.block-billing', [
          el('span.billing', 'Address (billing)'),
          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-billing-input.input.input-billing', {
              type: 'text',
              value: user.addresses[1].streetName,
              placeholder: 'street',
              data: 'streetName',
              disabled: true,
            }),
            el('.show-validation-street-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-billing', {
              type: 'text',
              value: user.addresses[1].city,
              placeholder: 'city',
              data: 'city',
              disabled: true,
            }),
            el('.show-validation-city-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-billing.input.input-billing.active', {
              type: 'text',
              value: getFullCountryName(user.addresses[1].country),
              placeholder: 'country',
              data: 'country',
              disabled: true,
            }),
            el('.show-validation-country-code-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-billing.input.input-billing.active', {
              type: 'text',
              value: user.addresses[1].postalCode,
              placeholder: 'postal code',
              data: 'postalCode',
              disabled: true,
            }),
            el('.show-validation-postal-code-input  show-validation'),
          ]),
          el('.block-billing-checkbox', [
            el('input#billing-default-checkbox.checkbox-reg', { type: 'checkbox', disabled: true }),
            el('label', 'Set billing as default address', { for: 'billing-default-checkbox' }),
          ]),
        ]),
      ]),
      this.createSaveButton(),
      this.createEditButton(),
    ]);
    this.validation.eventInput(infoBlock);
    this.validation.eventCheckBox(infoBlock, useShipping);
    return infoBlock;
  }

  private isFormValid(): boolean {
    const inputs = document.getElementsByClassName('input');
    let validInputs = 0;
    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      if (input.classList.contains('gender-input')) {
        return validInputs++;
      }
      this.validation.checkChangeInput(input);
      if (input.classList.contains('input-valid')) {
        return validInputs++;
      }
    });

    return validInputs === inputs.length;
  }

  private createSaveButton(): HTMLButtonElement {
    const button = el('button.save-button', 'save');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.disabled = true;
    button.addEventListener('click', async () => {
      const actions = collectAllInputsActions();
      if (this.isFormValid()) {
        const result = await updateUser(actions);
        if (!result) {
          throw new Error('User update failure');
        }
      }
    });
    return button;
  }

  private createEditButton(): HTMLButtonElement {
    const button = el('button.edit-button', 'edit');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', () => {
      toggleInputsState();
      toggleSaveButtonState();
    });
    return button;
  }

  private createEditPasswordButton(): HTMLButtonElement {
    const button = el('button.password-edit-button', 'edit password');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', () => {
      redirect(Route.EditPasswordPage);
    });
    return button;
  }

  protected build(): HTMLElement {
    return this.createUserInfoBlock();
  }
}

export { UserPage };
