import { Page } from '@templates/page';
import { el } from 'redom';
import { Address } from '@commercetools/platform-sdk';
import { getAddAddressAction, getSetDefaultShippingAddressAction } from '@helpers/get-actions';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { updateUser } from '@sdk/requests';
import { redirect } from '@app/router';
import { Route } from '@app/types/route';
import { UserPage } from './user-page';
import { ValidationForm } from '@validation/validation-registration-form';

class AddAddressPage extends Page {
  protected textObject = {
    title: 'User page',
  };

  private userPage = new UserPage();

  private validation = new ValidationForm();

  private createAddAddressBlock(): HTMLElement {
    const addAddressBlock = el('.add-address-block', [
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
          el('input.country-code-input-shipping.input.input-shipping.active', {
            type: 'text',
            placeholder: 'country',
            data: 'country',
          }),
          el('.show-validation-country-code-input show-validation'),
        ]),
        el('.input-block', [
          el('input.postal-code-input-shipping.input.input-shipping.active', {
            type: 'text',
            placeholder: 'postal code',
            data: 'postalCode',
          }),
          el('.show-validation-postal-code-input  show-validation'),
        ]),
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

      this.createSaveButton(),
    ]);

    this.validation.eventInput(addAddressBlock);
    return addAddressBlock;
  }

  private createSaveButton(): HTMLButtonElement {
    const button = el('button.save-button', 'save');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', async () => {
      const inputs = document.getElementsByClassName('input');
      const isAllInputsValid = Array.from(inputs).every((input) => input.classList.contains('input-valid'));

      if (isAllInputsValid) {
        const newUser = await updateUser([getAddAddressAction(this.collectNewAddressData())]);
        if (!newUser) {
          throw new Error('User update failure');
        }
        const newUseraddresses = newUser.body.addresses;
        const newAddressId = newUseraddresses[newUseraddresses.length - 1].id;
        if (!newAddressId) {
          throw new Error('Address id expected');
        }
        const setDefaultResponse = await updateUser([getSetDefaultShippingAddressAction(newAddressId)]);
        redirect(Route.UserPage);
        if (!setDefaultResponse) {
          throw new Error('User update failure');
        }
      }
    });
    return button;
  }

  private collectNewAddressData(): Address {
    const cityInput = safeQuerySelector('.city-input', document);
    const countryInput = safeQuerySelector('.country-code-input-shipping', document);
    const postalCodeInput = safeQuerySelector('.postal-code-input-shipping', document);
    const streetNameInput = safeQuerySelector('.street-input', document);
    if (
      !(cityInput instanceof HTMLInputElement) ||
      !(countryInput instanceof HTMLInputElement) ||
      !(postalCodeInput instanceof HTMLInputElement) ||
      !(streetNameInput instanceof HTMLInputElement)
    ) {
      throw new Error('Input expected');
    }
    const shortCountryName = this.validation.getCodeCountry(countryInput);

    const address: Address = {
      city: cityInput.value,
      country: shortCountryName,
      postalCode: postalCodeInput.value,
      streetName: streetNameInput.value,
    };
    return address;
  }

  protected build(): HTMLElement {
    return this.createAddAddressBlock();
  }
}
export { AddAddressPage };
