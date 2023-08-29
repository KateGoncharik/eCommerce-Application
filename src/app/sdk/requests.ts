import { getApiRoot } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';
import { ClientResponse, ErrorResponse, ProductProjection } from '@commercetools/platform-sdk';
import { DataUser } from '@customTypes/datauser';
import { UserState } from '@app/state';

const registerErrorMessage = 'Something went wrong. Try again';
const authErrorMessage = 'Wrong email or password. Try again or register';
const productsErrorMessage = 'No products found ';

export const createUser = async (form: DataUser): Promise<number | undefined> => {
  try {
    const request = await getApiRoot().customers().post(form).execute();
    return request.statusCode;
  } catch (e) {
    console.error(registerErrorMessage);
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
    console.error(authErrorMessage);
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
          const userState = new UserState();
          userState.rememberAuthorizedUser(result.body.customer);
        },
        (errorResponse: ClientResponse<ErrorResponse>) => {
          const emailInput = safeQuerySelector<HTMLInputElement>('.email-input', document);
          markInputAsInvalid(emailInput);
          const passwordInput = safeQuerySelector<HTMLInputElement>('.password-input', document);
          markInputAsInvalid(passwordInput);

          if (errorResponse.body.message === 'Customer account with the given credentials not found.') {
            return authErrorMessage;
          }
          return errorResponse.body.message;
        }
      );
  } catch (err) {
    console.error(err);
  }
}

export async function getProducts(): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot().productProjections().get().execute();
    const products = request.body.results;
    return products;
  } catch (err) {
    console.error(productsErrorMessage);
    return [];
  }
}
