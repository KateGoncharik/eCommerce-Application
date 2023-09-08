import { Customer } from '@commercetools/platform-sdk';
import { getUserOrError } from '@helpers/get-user-or-error ';

const userKey = 'user';
const genderKey = 'gender';

function rememberAuthorizedUser(customer: Customer): void {
  localStorage.setItem(userKey, JSON.stringify(customer));
}

function rememberUserGender(gender: string): void {
  localStorage.setItem(getUserOrError().id, gender);
}

function getUser(): Customer | null {
  const user = localStorage.getItem(userKey);
  if (user === null) {
    return user;
  }
  return JSON.parse(user);
}

function logOutUser(): void {
  localStorage.removeItem(userKey);
  localStorage.removeItem(genderKey);
}

function isUserAuthorized(): boolean {
  return !!localStorage.getItem(userKey);
}

function getUserGender(): string {
  const user = getUserOrError();
  const userGender = localStorage.getItem(user.id);
  if (!userGender) {
    return 'male';
  }
  return userGender;
}

export { getUser, getUserGender, isUserAuthorized, logOutUser, rememberAuthorizedUser, rememberUserGender };
