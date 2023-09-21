import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getRemoveAddressAction, collectAllInputsActions } from '@helpers/get-actions';
import { getUserOrError } from '@helpers/get-user-or-error ';
import { getFullCountryName } from '@helpers/get-full-country-name';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { toggleInputsState } from '@helpers/toggle-inputs-state';
import { toggleSaveButtonState } from '@helpers/toggle-save-button-state';
import { updateUser } from '@app/sdk/requests';
import { ValidationForm } from '@app/validation/validation-registration-form';
import { Route } from '@app/types/route';
import { redirect } from '@app/router';
import { getUserGender, getUser, rememberUserGender } from '@app/state';
import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';

class UserPage extends Page {
  private validation = new ValidationForm();
  
  protected textObject = {
    title: 'User page',
  };

  private createAvatar(): HTMLElement {
    const userGender = getUserGender();
    const src = this.getAvatarByGender(userGender);
    return el('img.avatar', { src: src, alt: 'girl' });
  }

  private getAvatarByGender(gender: string): HTMLImageElement {
    return gender === 'male' ? boyAvatar : girlAvatar;
  }

  private createUserInfoBlock(): HTMLElement {
    const user = getUserOrError();
    const userAddressesBlock = el('.user-addresses-block');
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
      el('.avatar-wrapper', [this.createAvatar()]),
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
        el('.input-block.hidden', [
          el('input.country-code-input-billing.input.input-billing.input-valid', {
            type: 'text',
            placeholder: 'country',
            data: 'country',
            disabled: true,
          }),
          el('.show-validation-country-code-input show-validation'),
        ]),
        el('.input-block.hidden', [
          el('input.postal-code-input-billing.input.input-billing.input-valid', {
            type: 'text',
            placeholder: 'postal code',
            data: 'postalCode',
            disabled: true,
          }),
          el('.show-validation-postal-code-input  show-validation'),
        ]),
      ]),
      userAddressesBlock,
      this.fillUserAddressesBlock(userAddressesBlock),
      this.createAddAddressButton(),
      this.createSaveButton(),
      this.createEditButton(),
    ]);
    this.validation.eventInput(infoBlock);

    return infoBlock;
  }

  public fillUserAddressesBlock(addressesBlock: HTMLElement): void {
    const user = getUser();
    if (user === null || !user.shippingAddressIds || !user.billingAddressIds) {
      throw new Error('User with addresses expected');
    }
    addressesBlock.innerHTML = '';
    const userShippingAddressesIds = user.shippingAddressIds;
    const userBillingAddressesIds = user.billingAddressIds;
    userShippingAddressesIds.forEach((shippingAddressId) => {
      mount(addressesBlock, this.createBlockShipping(shippingAddressId));
    });
    userBillingAddressesIds.forEach((billingAddressId) => {
      mount(addressesBlock, this.createBlockBilling(billingAddressId));
    });
  }

  private createBlockShipping(shippingAddressId: string): HTMLElement {
    const user = getUser();
    if (user === null || !user.shippingAddressIds) {
      throw new Error('No user found');
    }
    const currentAddress = user.addresses.filter((address) => address.id === shippingAddressId)[0];
    return el(`.block-shipping`, [
      el('span.shipping', `Address ${shippingAddressId} (shipping)`),
      el('.input-block', [
        el('span.addresses-subtitle', 'Street'),
        el('input.street-input.input.input-shipping', {
          type: 'text',
          value: currentAddress.streetName,
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
          value: currentAddress.city,
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
          value: getFullCountryName(currentAddress.country),
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
          value: currentAddress.postalCode,
          placeholder: 'postal code',
          data: 'postalCode',
          disabled: true,
        }),
        el('.show-validation-postal-code-input  show-validation'),
      ]),
      this.createRemoveAddressButton(shippingAddressId),
    ]);
  }

  private createBlockBilling(billingAddressId: string): HTMLElement {
    const user = getUser();
    if (user === null || !user.billingAddressIds) {
      throw new Error('No user found');
    }
    const currentAddress = user.addresses.filter((address) => address.id === billingAddressId)[0];
    return el(`.block-billing`, [
      el('span.billing', `Address ${billingAddressId} (billing)`),
      el('.input-block', [
        el('span.addresses-subtitle', 'Street'),
        el('input.street-billing-input.input.input-billing', {
          type: 'text',
          value: currentAddress.streetName,
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
          value: currentAddress.city,
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
          value: getFullCountryName(currentAddress.country),
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
          value: currentAddress.postalCode,
          placeholder: 'postal code',
          data: 'postalCode',
          disabled: true,
        }),
        el('.show-validation-postal-code-input  show-validation'),
      ]),
      this.createRemoveAddressButton(billingAddressId),
    ]);
  }

  private isFormValid(): boolean {
    const inputs = document.getElementsByClassName('input');
    let validInputs = 0;
    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      if (
        input.classList.contains('gender-input') ||
        input.classList.contains('country-code-input-billing') ||
        input.classList.contains('postal-code-input-billing')
      ) {
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
      const genderInput = safeQuerySelector<HTMLInputElement>('.gender-input', document);
      if (this.isFormValid() && genderInput.classList.contains('input-valid')) {
        const result = await updateUser(collectAllInputsActions());
        if (!result) {
          throw new Error('User update failure');
        }
        rememberUserGender(genderInput.value);
        const avatarWrapper = safeQuerySelector('.avatar-wrapper');
        avatarWrapper.innerHTML = '';
        mount(avatarWrapper, this.createAvatar());
      }
    });
    return button;
  }

  private createAddAddressButton(): HTMLButtonElement {
    const button = el('button.add-address-button', 'add address');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', () => {
      redirect(Route.AddAddressPage);
    });
    return button;
  }

  private createRemoveAddressButton(id: string): HTMLButtonElement {
    const removeButton = el('button.remove-address-button', 'remove');
    if (!(removeButton instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    removeButton.addEventListener('click', async () => {
      const result = await updateUser([getRemoveAddressAction(id)]);
      if (!result) {
        throw new Error('User update failure');
      }
      const userAddressesBlock = safeQuerySelector('.user-addresses-block', document);
      this.fillUserAddressesBlock(userAddressesBlock);
    });
    return removeButton;
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
