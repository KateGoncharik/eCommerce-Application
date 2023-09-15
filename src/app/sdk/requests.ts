import { getApiRoot, getApiRootForCartRequests } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';
import {
  ClientResponse,
  Customer,
  CustomerUpdateAction,
  ErrorResponse,
  ProductProjection,
  Category,
  CustomerChangePassword,
  Cart,
} from '@commercetools/platform-sdk';
import { rememberAuthorizedUser } from '@app/state';
import { getUserOrError } from '@helpers/get-user-or-error ';
import { DataUser } from '@customTypes/datauser';
import { ProductData } from '@customTypes/data-product';

const errorMessage = 'Error: no connection to server';

export async function createUser(form: DataUser): Promise<number | undefined> {
  try {
    const request = await getApiRoot().customers().post(form).execute();
    return request.statusCode;
  } catch (e) {
    console.error(errorMessage);
  }
}

export async function isUserExist(email: string): Promise<boolean | void> {
  try {
    const result = await getApiRoot()
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute();
    return result.body.count > 0;
  } catch (err) {
    console.error(errorMessage);
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
    console.error(err);
  }
}

export async function updateUser(actions: CustomerUpdateAction[]): Promise<ClientResponse<Customer> | null> {
  try {
    const user = getUserOrError();
    const request = await getApiRoot()
      .customers()
      .withId({ ID: user.id })
      .post({ body: { version: user.version, actions: actions } })
      .execute();
    rememberAuthorizedUser(request.body);
    alert('Your information was successfully updated');
    return request;
  } catch (e) {
    alert('Something went wrong. Try again');
    console.error(errorMessage);
  }
  return null;
}

export async function editUserPassword(body: CustomerChangePassword): Promise<ClientResponse<Customer> | null> {
  try {
    const request = await getApiRoot().customers().password().post({ body: body }).execute();
    rememberAuthorizedUser(request.body);
    alert('Your password was successfully updated');
    return request;
  } catch (e) {
    alert('Something went wrong. Try again');
    console.error(errorMessage);
  }
  return null;
}

export async function getProducts(): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot().productProjections().get().execute();
    const products = request.body.results;
    return products;
  } catch (err) {
    console.error(errorMessage);
    return [];
  }
}

export const returnProductByKey = (productKey: string): Promise<ClientResponse> => {
  return getApiRoot().products().withKey({ key: productKey }).get().execute();
};

export const getProduct = async (key: string): Promise<ProductData | void> => {
  return returnProductByKey(key)
    .then(({ body }) => {
      const { current } = body.masterData;
      const price = current.masterVariant.prices[0];
      const productData = {
        id: body.id,
        name: current.name['en-US'],
        img: current.masterVariant.images,
        description: current.description['en-US'],
        price: price.value.centAmount,
        discount: price.discounted && price.discounted.value.centAmount,
      };

      return productData;
    })
    .catch(() => console.error(errorMessage));
};

export async function getProductsOfCategory(id: string): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot()
      .productProjections()
      .get({ queryArgs: { where: `categories(id="${id}")` } })
      .execute();
    const products = request.body.results;
    return products;
  } catch (err) {
    console.error(errorMessage);
    return [];
  }
}

export async function getFilteredProducts(queryString: string | string[]): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot()
      .productProjections()
      .search()
      .get({ queryArgs: { filter: queryString } })
      .execute();
    const products = request.body.results;
    return products;
  } catch (err) {
    console.error(errorMessage);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await getApiRoot().categories().get().execute();
    return categories.body.results;
  } catch (err) {
    console.error(errorMessage);
    return [];
  }
}

export async function getCategoryByKey(key: string): Promise<Category | void> {
  try {
    const categories = await getApiRoot().categories().withKey({ key }).get().execute();
    return categories.body;
  } catch (err) {
    console.error(errorMessage);
  }
}

export async function createCart(): Promise<Cart | null> {
  try {
    const cart = await getApiRootForCartRequests()
      .me()
      .carts()
      .post({ body: { currency: 'USD' } })
      .execute();
    return cart.body;
  } catch (err) {
    console.error(errorMessage);
    return null;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cart = await getApiRootForCartRequests().me().activeCart().get().execute();
    return cart.body;
  } catch (err) {
    if (err instanceof Error && err.name !== 'NotFound') {
      console.error(errorMessage);
    }
    return null;
  }
}

export async function updateLineItemQuantity(itemId: string, newQuantity: number): Promise<Cart | null> {
  try {
    const userCart = await getCart();
    if (!userCart) {
      throw new Error('No cart found');
    }
    const response = await getApiRootForCartRequests()
      .me()
      .carts()
      .withId({ ID: userCart.id })
      .post({
        body: {
          version: userCart.version,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId: itemId,
              quantity: newQuantity,
            },
          ],
        },
      })
      .execute();
    return response.body;
  } catch (err) {
    console.error(errorMessage);
    return null;
  }
}

export async function recalculateCartCost(): Promise<Cart | null> {
  try {
    const userCart = await getCart();
    if (!userCart) {
      throw new Error('No cart found');
    }
    const response = await getApiRootForCartRequests()
      .me()
      .carts()
      .withId({ ID: userCart.id })
      .post({
        body: {
          version: userCart.version,
          actions: [
            {
              action: 'recalculate',
              updateProductData: false,
            },
          ],
        },
      })
      .execute();
    return response.body;
  } catch (err) {
    console.error(errorMessage);
    return null;
  }
}

export async function addProductToCart(productId: string, cartID: string, versionCart: number): Promise<Cart | null> {
  try {
    const cart = await getApiRootForCartRequests()
      .carts()
      .withId({
        ID: cartID,
      })
      .post({
        body: {
          version: versionCart,
          actions: [
            {
              action: 'addLineItem',
              productId: productId,
              quantity: 1,
            },
          ],
        },
      })
      .execute();
    return cart.body;
  } catch (err) {
    console.error(errorMessage);
    return null;
  }
}
