import { getApiRoot } from '@sdk/build-client';

export async function isUserExist(email: string): Promise<boolean> {
  const result = await getApiRoot()
    .customers()
    .get({ queryArgs: { where: `email="${email}"` } })
    .execute();
  return result.body.count > 0;
}

export async function authorize(email: string, password: string): Promise<boolean> {
  console.log('look here', getApiRoot);

  /*

        далаем запрос на login передавая username + pass (см.видео)
            что бы сделать запрос, нам надо сконфигурировать APIRoot что бы он использовал аутентификацию по username + password
    */

  try {
    await getApiRoot()
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
