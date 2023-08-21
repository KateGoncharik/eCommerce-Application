import { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';
import { withPasswordFlowClient } from '@sdk/login-api';
import { State } from '@app/state';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';

export async function authorizeUser(email: string, password: string): Promise<void | string> {
  return await withPasswordFlowClient(email, password)
    .login()
    .post({ body: { email: email, password: password } })
    .execute()
    .then(
      (result) => {
        State.user = result.body.customer;
      },
      (errorResponse: ClientResponse<ErrorResponse>) => {
        const emailInput = safeQuerySelector<HTMLInputElement>('.email-input', document);
        markInputAsInvalid(emailInput);
        const passwordInput = safeQuerySelector<HTMLInputElement>('.password-input', document);
        markInputAsInvalid(passwordInput);

        if (errorResponse.body.message === 'Customer account with the given credentials not found.') {
          return 'Wrong email or password. Try again or register';
        }
        return errorResponse.body.message;
      }
    );
} //TODO make catch instead of then
