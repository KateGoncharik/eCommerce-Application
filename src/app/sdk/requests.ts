import { getApiRoot } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';
import { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';
import { DataUser } from '@app/types/datauser';
import { rememberAuthorizedUser } from '@app/state';

export const createUser = async (form: DataUser): Promise<number | undefined> => {
  try {
    const request = await getApiRoot().customers().post(form).execute();
    return request.statusCode;
  } catch (e) {
    console.log('Error: no connection to server');
  }
};

export async function isUserExist(email: string): Promise<boolean | void> {
  try {
    const result = await getApiRoot()
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute();
    return result.body.count > 0;
  } catch (err) {
    console.log('Error: no connection to server');
  }
}

export async function authorizeUser(email: string, password: string): Promise<void | string> {
  try {
    return await withPasswordFlowClient(email, password)
      .login()
      .post({ body: { email: email, password: password } })
      .execute()
      .then(
        (result) => {
          rememberAuthorizedUser(result.body.customer);
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
  } catch (err) {
    console.log('Error: no connection to server');
  }
}
//TODO make catch instead of then

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const queryProduct = (productID: string): => {
//   return getApiRoot()
//     .products()
//     .withId({ ID: productID })
//     .get()
//     .execute();
// };

// queryProduct('cake-sparklers')
//   .then(({ body }) => {
//     console.log(body.version);
//   })
//   .catch(console.error);

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const returnProductByKey = (productKey: string): Promise<ClientResponse<any>> => {
//   return getApiRoot().products().withKey({ key: productKey }).get().execute();
// };

// // Output the Product's current English name
// returnProductByKey('cake-sparklers')
//   .then(({ body }) => {
//     console.log('ddddd');
//     console.log(body.masterData.current.name['en']);
//   })
//   .catch(console.error);
