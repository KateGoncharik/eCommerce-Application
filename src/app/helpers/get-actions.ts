import { Address, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { safeQuerySelector } from './safe-query-selector';

export function getFirstNameAction(newFirstName: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'setFirstName',
    firstName: newFirstName,
  };
  return action;
}
export function getLastNameAction(newLastName: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'setLastName',
    lastName: newLastName,
  };
  return action;
}
export function getDateOfBirthAction(newDateOfBirth: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'setDateOfBirth',
    dateOfBirth: newDateOfBirth,
  };
  return action;
}
export function getChangeEmailAction(newEmail: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'changeEmail',
    email: newEmail,
  };
  return action;
}

export function getRemoveAddressAction(addressId: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'removeAddress',
    addressId,
  };
  return action;
}

export function getAddAddressAction(address: Address): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'addAddress',
    address: address,
  };
  return action;
}

export function getSetDefaultShippingAddressAction(addressId: string): CustomerUpdateAction {
  const action: CustomerUpdateAction = {
    action: 'setDefaultShippingAddress',
    addressId,
  };
  return action;
}

export function collectAllInputsActions(): CustomerUpdateAction[] {
  const firstNameInput = safeQuerySelector('.first-name-input', document);
  const lastNameInput = safeQuerySelector('.last-name-input', document);
  const dateInput = safeQuerySelector('.date-input', document);
  const emailInput = safeQuerySelector('.email-input', document);

  if (
    !(firstNameInput instanceof HTMLInputElement) ||
    !(lastNameInput instanceof HTMLInputElement) ||
    !(dateInput instanceof HTMLInputElement) ||
    !(emailInput instanceof HTMLInputElement)
  ) {
    throw new Error('Input expected');
  }
  return [
    getFirstNameAction(firstNameInput.value),
    getLastNameAction(lastNameInput.value),
    getDateOfBirthAction(dateInput.value),
    getChangeEmailAction(emailInput.value),
  ];
}
