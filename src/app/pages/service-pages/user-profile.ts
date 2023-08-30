import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getAvatarByGender } from '@helpers/get-avatar-by-gender';
import { getUserGender, getUser } from '@app/state';

class UserPage extends Page {
  protected textObject = {
    title: 'User page',
  };

  private createAvatar(): HTMLElement {
    const userAvatarWrapper = el('.user-avatar-wrapper');
    const userGender = getUserGender();

    const src = getAvatarByGender(userGender);
    const userAvatar = el('.avatar-wrapper', [el('img.avatar', { src: src, alt: 'girl' })]);
    mount(userAvatarWrapper, userAvatar);
    return userAvatarWrapper;
  }

  private createUserInfoBlock(): HTMLElement {
    const infoBlock = el('.user-info-wrapper', [
      el('span.user-info-title', 'User information'),
      this.createAvatar(),
      el('.user-info-block', [
        el('.user-name-block', [
          el('.input-block', [
            el('span.user-info-subtitle', 'First name'),
            el('input.first-name.input', {
              type: 'text',
              placeholder: `${getUser().firstName}`,
              data: 'firstName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.user-info-subtitle', 'Last name'),
            el('input.last-name.input', {
              type: 'text',
              placeholder: `${getUser().lastName}`,
              data: 'lastName',
              disabled: true,
            }),
          ]),
        ]),

        el('.user-date-gender-block', [
          el('.input-block', [
            el('span.user-info-subtitle', 'Birth date'),
            el('input.date-input.input', {
              type: 'text',
              placeholder: `${getUser().dateOfBirth}`,
              data: 'dateOfBirth',
              disabled: true,
            }),
          ]),
          el('.input-gender-block', [
            el('span.user-info-subtitle', 'Gender'),
            el('input.gender-input', {
              type: 'text',
              placeholder: `${getUserGender()}`,
              name: 'gender',
              disabled: true,
            }),
          ]),
        ]),
      ]),

      el('.user-addresses-block', [
        el('.block-shipping.default', [
          el('span.shipping', 'Address (shipping)'),

          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-input.input.input-shipping', {
              type: 'text',
              placeholder: `${getUser().addresses[0].streetName} `,
              data: 'streetName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-shipping', {
              type: 'text',
              placeholder: `${getUser().addresses[0].city}`,
              data: 'city',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-shipping.input.input-shipping', {
              type: 'text',
              placeholder: `${getUser().addresses[0].country}`,
              data: 'country',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-shipping.input.input-shipping', {
              type: 'text',
              placeholder: `${getUser().addresses[0].postalCode}`,
              data: 'postalCode',
              disabled: true,
            }),
          ]),
        ]),
        el('.block-billing', [
          el('span.billing', 'Address (billing)'),
          el('.input-block', [
            el('span.addresses-subtitle', 'Street'),
            el('input.street-input.input.input-billing', {
              type: 'text',
              placeholder: `${getUser().addresses[1].streetName}`,
              data: 'streetName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-billing', {
              type: 'text',
              placeholder: `${getUser().addresses[1].city}`,
              data: 'city',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-billing.input.input-billing', {
              type: 'text',
              placeholder: `${getUser().addresses[1].country}`,
              data: 'country',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-billing.input.input-billing', {
              type: 'text',
              placeholder: `${getUser().addresses[1].postalCode}`,
              data: 'postalCode',
              disabled: true,
            }),
          ]),
        ]),
      ]),
      this.createEditButton(),
    ]);
    return infoBlock;
  }
  private createEditButton(): HTMLButtonElement {
    const button = el('button.edit-button', 'Edit information');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    return button;
  }

  protected build(): HTMLElement {
    return this.createUserInfoBlock();
  }
}

export { UserPage };
