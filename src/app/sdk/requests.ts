import { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';
import { withPasswordFlowClient } from '@sdk/login-api';

export async function authorizeUser(email: string, password: string): Promise<void | string> {
  return await withPasswordFlowClient(email, password)
    .login()
    .post({ body: { email: email, password: password } })
    .execute()
    .then(
      () => {},
      (errorResponse: ClientResponse<ErrorResponse>) => {
        if (errorResponse.body.message === 'Customer account with the given credentials not found.') {
          return 'Wrong email or password. Try again or register';
        }
        return errorResponse.body.message;
      }
    );
} //TODO make catch instead of then
