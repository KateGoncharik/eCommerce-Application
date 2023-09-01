import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getUserGender, getUser } from '@app/state';
import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';
import { getFullCountryName } from '@app/edit/edit-user-profile';
import { ValidationForm } from '@app/validation/validation-registration-form';

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
    const useShipping = el('input#use-shipping-for-billing.checkbox-reg', { type: 'checkbox' });
    const genderInput = el('input.gender-input', {
      type: 'text',
      placeholder: `${getUserGender()}`,
      name: 'gender',
    });
    if (!(genderInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    const infoBlock = el('.user-info-wrapper', [
      el('span.user-info-title', 'User information'),
      this.createAvatar(),
      el('.user-info-block', [
        el('.user-name-block', [
          el('.input-block', [
            el('span.user-info-subtitle', 'First name'),
            el('input.first-name-input.input', {
              type: 'text',
              value: `${getUser().firstName}`,
              placeholder: 'first name',
              data: 'firstName',
            }),
            el('.show-validation-first-name-input show-validation'),
          ]),
          el('.input-block', [
            el('span.user-info-subtitle', 'Last name'),
            el('input.last-name-input.input', {
              type: 'text',
              value: `${getUser().lastName}`,
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
              value: `${getUser().dateOfBirth}`,
              placeholder: 'date',
              data: 'dateOfBirth',
            }),
            el('.show-validation-date-input show-validation'),
          ]),
          el('.input-gender-block', [el('span.user-info-subtitle', 'Gender'), genderInput]),
          el('.show-validation-gender show-validation'),
        ]),
      ]),

      el('.user-addresses-block', [
        el('.block-shipping.default', [
          el('span.shipping', 'Address (shipping)'),

          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-input.input.input-shipping', {
              type: 'text',
              value: `${getUser().addresses[0].streetName} `,
              placeholder: 'street',
              data: 'streetName',
            }),
            el('.show-validation-street-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.shipping-input', {
              type: 'text',
              value: `${getUser().addresses[0].city}`,
              placeholder: 'city',
              data: 'city',
            }),
            el('.show-validation-city-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-shipping.input.shipping-input.active', {
              type: 'text',
              value: getFullCountryName(getUser().addresses[0].country),
              placeholder: 'country',
              data: 'country',
            }),
            el('.show-validation-country-code-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-shipping.input.input-shipping.active', {
              type: 'text',
              value: `${getUser().addresses[0].postalCode}`,
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
              value: `${getUser().addresses[1].streetName}`,
              placeholder: 'street',
              data: 'streetName',
            }),
            el('.show-validation-street-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-billing', {
              type: 'text',
              value: `${getUser().addresses[1].city}`,
              placeholder: 'city',
              data: 'city',
            }),
            el('.show-validation-city-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-billing.input.input-billing.active', {
              type: 'text',
              value: getFullCountryName(getUser().addresses[1].country),
              placeholder: 'country',
              data: 'country',
            }),
            el('.show-validation-country-code-input show-validation'),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-billing.input.input-billing.active', {
              type: 'text',
              value: `${getUser().addresses[1].postalCode}`,
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
      this.createSaveButton(() => {}),
    ]);

    this.handleListenerInGenderInput(genderInput);
    this.validation.eventInput(infoBlock);
    this.validation.eventCheckBox(infoBlock, useShipping);
    return infoBlock;
  }

  private handleListenerInGenderInput(input: HTMLInputElement): void {
    input.addEventListener('input', () => {
      this.validation.validateGenderInput(input);
    });
  }

  private createSaveButton(handler: () => void): HTMLButtonElement {
    const button = el(`button.save-button`, `save`);
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', () => {
      handler();
    });
    return button;
  }

  protected build(): HTMLElement {
    return this.createUserInfoBlock();
  }
}

export { UserPage };
