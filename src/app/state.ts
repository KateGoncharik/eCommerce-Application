import { Customer } from '@commercetools/platform-sdk';

const userKey = 'user';
const genderKey = 'gender';

export function rememberAuthorizedUser(customer: Customer): void {
  localStorage.setItem(userKey, JSON.stringify(customer));
}

export function rememberUserGender(gender: string | null): void {
  if (gender === null) {
    return;
  }
  const user = localStorage.getItem('user');
  if (!user) {
    throw new Error('No user found');
  }
  const parsedUser = JSON.parse(user);
  if (parsedUser.id in localStorage) {
    localStorage.removeItem(parsedUser.id);
  }
  localStorage.setItem(parsedUser.id, `{ gender: ${gender}}`);
  localStorage.getItem(parsedUser.id);
}

export function logOutUser(): void {
  localStorage.removeItem(userKey);
  localStorage.removeItem(genderKey);
}

export function isUserAuthorized(): boolean {
  return !!localStorage.getItem(userKey);
}
