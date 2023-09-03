import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getUserGender, getUser } from '@app/state';
import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';
import { getFullCountryName } from '@helpers/get-full-country-name';
import { ValidationForm } from '@app/validation/validation-registration-form';
import { updateUser } from '@app/sdk/requests';
import { collectAllInputsActions } from '@helpers/get-actions';

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
    const useShipping = el('input#use-shipping-for-billing.checkbox-reg', { type: 'checkbox' });
    const genderInput = el('input.gender-input', {
      type: 'text',
      value: getUserGender(),
      placeholder: 'gender',
      name: 'gender',
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
            }),
            el('.show-validation-date-input show-validation'),
          ]),
          el('.input-gender-block', [el('span.user-info-subtitle', 'Gender'), genderInput]),
          el('.show-validation-gender show-validation'),
        ]),
      ]),
      el('.input-block', [
        el('span.user-info-subtitle', 'Email'),
        el('input.email-input.input', {
          type: 'text',
          value: user.email,
          placeholder: 'email',
          data: 'email',
        }),
        el('.show-validation-email-input show-validation'),
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
          el('span.billing', 'Address (billing)'),
          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-billing-input.input.input-billing', {
              type: 'text',
              value: user.addresses[1].streetName,
              placeholder: 'street',
              data: 'streetName',
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
            }),
            el('.show-validation-postal-code-input  show-validation'),
          ]),
          el('.block-billing-checkbox', [
            el('input#billing-default-checkbox.checkbox-reg', { type: 'checkbox' }),
            el('label', 'Set billing as default address', { for: 'billing-default-checkbox' }),
          ]),
        ]),
      ]),
      this.createSaveButton(),
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
      this.validation.checkChangeInput(input);
      if (input.classList.contains('input-valid')) {
        return validInputs++;
      }
      this.validation.checkChangeInput(input);
    });

    return validInputs === inputs.length;
  }

  private createSaveButton(): HTMLButtonElement {
    const button = el(`button.save-button`, `save`);
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
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

  protected build(): HTMLElement {
    return this.createUserInfoBlock();
  }
}

export { UserPage };
