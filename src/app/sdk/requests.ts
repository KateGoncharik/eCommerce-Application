import { getApiRoot } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';

export async function isUserExist(email: string): Promise<boolean> {
  const result = await getApiRoot()
    .customers()
    .get({ queryArgs: { where: `email="${email}"` } })
    .execute();
  return result.body.count > 0;
}

export async function authorizeUser(email: string, password: string): Promise<unknown> {
  try {
    const request = await withPasswordFlowClient(email, password)
      .login()
      .post({ body: { email: email, password: password } })
      .execute();
    return request;
  } catch (e) {
    console.log(e);

    //TODO use BadRequest obj instead. Now we have import issue
    if (typeof e === 'object' && e && 'statusCode' in e && e.statusCode === 400) {
      return false;
    }
    throw e;
  }
}
