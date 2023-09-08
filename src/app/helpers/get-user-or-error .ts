import { Customer } from '@commercetools/platform-sdk';
import { getUser } from '@app/state';

export function getUserOrError(): Customer {
  const user = getUser();
  if (user === null) {
    throw new Error('User expected');
  }
  return user;
}
