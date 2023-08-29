import { Customer } from '@commercetools/platform-sdk';

const userKey = 'user';
const genderKey = 'gender';

class UserState {
  public rememberAuthorizedUser(customer: Customer): void {
    localStorage.setItem(userKey, JSON.stringify(customer));
  }

  public getUser(): string {
    return localStorage.getItem(userKey)!;
  }

  public logOutUser(): void {
    localStorage.removeItem(userKey);
    localStorage.removeItem(genderKey);
  }

  public isUserAuthorized(): boolean {
    return !!localStorage.getItem(userKey);
  }
}

export { UserState };
