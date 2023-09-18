import { Address, CartUpdateAction, CustomerUpdateAction, LineItem } from '@commercetools/platform-sdk';
import { safeQuerySelector } from './safe-query-selector';
// import { deleteProductFromCart } from '@sdk/requests';

export function getFirstNameAction(newFirstName: string): CustomerUpdateAction {
  return {
    action: 'setFirstName',
    firstName: newFirstName,
  };
}
export function getLastNameAction(newLastName: string): CustomerUpdateAction {
  return {
    action: 'setLastName',
    lastName: newLastName,
  };
}
export function getDateOfBirthAction(newDateOfBirth: string): CustomerUpdateAction {
  return {
    action: 'setDateOfBirth',
    dateOfBirth: newDateOfBirth,
  };
}
export function getChangeEmailAction(newEmail: string): CustomerUpdateAction {
  return {
    action: 'changeEmail',
    email: newEmail,
  };
}

export function getRemoveAddressAction(addressId: string): CustomerUpdateAction {
  return {
    action: 'removeAddress',
    addressId,
  };
}

export function getAddAddressAction(address: Address): CustomerUpdateAction {
  return {
    action: 'addAddress',
    address: address,
  };
}

export function getSetDefaultShippingAddressAction(addressId: string): CustomerUpdateAction {
  return {
    action: 'setDefaultShippingAddress',
    addressId,
  };
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

export function getRemoveItemAction(itemId: string, itemQuantity: number): CartUpdateAction {
  return {
    action: 'removeLineItem',
    lineItemId: itemId,
    quantity: itemQuantity,
  };
}

export function getAllItemsRemoveActions(lineItems: LineItem[]): CartUpdateAction[] {
  const actions: CartUpdateAction[] = [];
  lineItems.forEach((item) => {
    actions.push(getRemoveItemAction(item.id, item.quantity));
  });
  return actions;

  // deleteProductFromCart(itemId, )4 arguments - we need to get cartId + we need to do it all at once - array
}
