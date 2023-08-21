import { getApiRoot } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';
import { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';
import { DataUser } from '@app/types/datauser';

const createUser = async (form: DataUser): Promise<number | undefined> => {
  try {
    const request = await getApiRoot().customers().post(form).execute();
    return request.statusCode;
  } catch (err) {
    console.log(err);
  }
};
export { createUser };

export async function authorizeUser(email: string, password: string): Promise<void | string> {
  return await withPasswordFlowClient(email, password)
    .login()
    .post({ body: { email: email, password: password } })
    .execute()
    .then(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.body.customer));
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
