import { UserState } from '@app/state';

export function getUserGender(): string {
  const userState = new UserState();
  const user = userState.getUser();
  const parsedUser = JSON.parse(user);
  const userGender = localStorage.getItem(parsedUser.id);
  if (!userGender) {
    return 'male';
  }
  return userGender;
}
