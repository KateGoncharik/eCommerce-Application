import { Customer } from '@commercetools/platform-sdk';

const userKey = 'user';

export function rememberAuthorizedUser(customer: Customer): void {
  localStorage.setItem(userKey, JSON.stringify(customer));
}

export function logOutUser(): void {
  localStorage.removeItem(userKey);
}

export function isUserAuthorized(): boolean {
  return !!localStorage.getItem(userKey);
}
