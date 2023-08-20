import { ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { withPasswordFlowClient } from '@sdk/login-api';

export async function authorizeUser(email: string, password: string): Promise<ClientResponse<CustomerSignInResult>> {
  try {
    const request = await withPasswordFlowClient(email, password)
      .login()
      .post({ body: { email: email, password: password } })
      .execute();
    return request;
  } catch (e) {
    console.log(e);

    //TODO use BadRequest obj instead. Now we have import issue
    // if (typeof e === 'object' && e && 'statusCode' in e && e.statusCode === 400) {
    //   return false;
    // }
    throw e;
  }
}
