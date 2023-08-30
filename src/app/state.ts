import { Customer } from '@commercetools/platform-sdk';

const userKey = 'user';
const genderKey = 'gender';

function rememberAuthorizedUser(customer: Customer): void {
  localStorage.setItem(userKey, JSON.stringify(customer));
}

function getUser(): Customer {
  return JSON.parse(localStorage.getItem(userKey)!);
}

function logOutUser(): void {
  localStorage.removeItem(userKey);
  localStorage.removeItem(genderKey);
}

function isUserAuthorized(): boolean {
  return !!localStorage.getItem(userKey);
}

function getUserGender(): string {
  const user = getUser();
  const userGender = localStorage.getItem(user.id);
  if (!userGender) {
    return 'male';
  }
  return userGender;
}

export { getUser, getUserGender, isUserAuthorized, logOutUser, rememberAuthorizedUser };
