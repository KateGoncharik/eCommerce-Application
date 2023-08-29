import { Customer } from '@commercetools/platform-sdk';
import { Page } from '@templates/page';
import { el, mount } from 'redom';
import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';

class UserPage extends Page {
  protected textObject = {
    title: 'User page',
  };

  private createAvatar(): HTMLElement {
    const userAvatarWrapper = el('.user-avatar-wrapper');
    const userGender = this.getUserGender();

    if (userGender === 'female') {
      const userAvatar = el('.avatar-wrapper', [el('img.avatar', { src: girlAvatar, alt: 'girl' })]);
      mount(userAvatarWrapper, userAvatar);
    } else {
      const userAvatar = el('.avatar-wrapper', [el('img.avatar', { src: boyAvatar, alt: 'boy' })]);
      mount(userAvatarWrapper, userAvatar);
    }
    return userAvatarWrapper;
  }

  private getUserGender(): string {
    const user = localStorage.getItem('user');
    if (user === null) {
      throw new Error('No user');
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.id) {
      const userGender = localStorage.getItem(parsedUser.id);
      if (!userGender) {
        return 'male';
      }
      return userGender;
    }
    throw new Error('Incorrect user object');
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
              placeholder: `${this.getUserInfo().firstName}`,
              data: 'firstName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.user-info-subtitle', 'Last name'),
            el('input.last-name.input', {
              type: 'text',
              placeholder: `${this.getUserInfo().lastName}`,
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
              placeholder: `${this.getUserInfo().dateOfBirth}`,
              data: 'dateOfBirth',
              disabled: true,
            }),
          ]),
          el('.input-gender-block', [
            el('span.user-info-subtitle', 'Gender'),
            el('input.gender-input', {
              type: 'text',
              placeholder: `${this.getUserGender()}`,
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
              placeholder: `${this.getUserInfo().addresses[0].streetName} `,
              data: 'streetName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-shipping', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[0].city}`,
              data: 'city',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-shipping.input.input-shipping', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[0].country}`,
              data: 'country',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-shipping.input.input-shipping', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[0].postalCode}`,
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
              placeholder: `${this.getUserInfo().addresses[1].streetName}`,
              data: 'streetName',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'City'),
            el('input.city-input.input.input-billing', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[1].city}`,
              data: 'city',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Country'),
            el('input.country-code-input-billing.input.input-billing', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[1].country}`,
              data: 'country',
              disabled: true,
            }),
          ]),
          el('.input-block', [
            el('span.addresses-subtitle', 'Postal code'),
            el('input.postal-code-input-billing.input.input-billing', {
              type: 'text',
              placeholder: `${this.getUserInfo().addresses[1].postalCode}`,
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
    button.addEventListener('click', () => console.log('here will be edit function'));
    return button;
  }

  private getUserInfo(): Customer {
    const authenticatedUser = localStorage.getItem('user');
    if (!authenticatedUser) {
      throw new Error('No authenticated user');
    } else {
      const parsedUser = JSON.parse(authenticatedUser);
      return parsedUser;
    }
  }

  protected build(): HTMLElement {
    const userInfo = this.createUserInfoBlock();
    return userInfo;
  }
}

export { UserPage };
