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
        return errorResponse.body.message;
      }
    );
}
