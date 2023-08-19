import { getApiRoot } from '@sdk/build-client';
// import { withPasswordFlowClient } from '@sdk/login-api';

export async function isUserExist(email: string): Promise<boolean> {
  const result = await getApiRoot()
    .customers()
    .get({ queryArgs: { where: `email="${email}"` } })
    .execute();
  return result.body.count > 0;
}

export async function authorize(email: string, password: string): Promise<boolean> {
  /*

        далаем запрос на login передавая username + pass (см.видео)
            что бы сделать запрос, нам надо сконфигурировать APIRoot что бы он использовал аутентификацию по username + password
    */

  try {
    await getApiRoot() // здесь я вместо 20 строки писала это -> await withPasswordFlowClient(email, password)
      .login()
      .post({ body: { email: email, password: password } })
      .execute();
    return true;
  } catch (e) {
    //todo use BadRequest obj instead. Now we have import issue
    if (typeof e === 'object' && e && 'statusCode' in e && e.statusCode === 400) {
      return false;
    }
    throw e;
  }
}
