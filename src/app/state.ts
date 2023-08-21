import { Customer } from '@commercetools/platform-sdk';
export const State: State = {
  user: undefined,
};
type State = {
  user: Customer | undefined;
};
