import { getApiRoot } from '@sdk/build-client';
import { withPasswordFlowClient } from '@sdk/login-api';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { markInputAsInvalid } from '@helpers/toggle-validation-state';
import { ClientResponse, ErrorResponse, ProductProjection } from '@commercetools/platform-sdk';
import { DataUser } from '@customTypes/datauser';
import { rememberAuthorizedUser } from '@app/state';

const errorMessage = 'Wrong email or password. Try again or register';

export const createUser = async (form: DataUser): Promise<number | undefined> => {
  try {
    const request = await getApiRoot().customers().post(form).execute();
    return request.statusCode;
  } catch (e) {
    console.log(errorMessage);
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
    console.log(errorMessage);
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
    console.log(errorMessage);
  }
}

export async function getProducts(): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot().productProjections().get().execute();
    const products = request.body.results;
    return products;
  } catch (err) {
    console.log(errorMessage);
    return [];
  }
}
//TODO make catch instead of then

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const queryProduct = (productID: string):Promise<ClientResponse<any>> => {
//   return getApiRoot()
//     .products()
//     .withId({ ID: productID })
//     .get()
//     .execute();
// };

// queryProduct('7dfdebc7-4d74-40a8-9e6d-24602e47adb7')
//   .then(({ body }) => {
//     console.log(body.version);
//   })
//   .catch(console.error);

const objProd: Record<string, string> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const returnProductByKey = (productKey: string): Promise<ClientResponse<any>> => {
  return getApiRoot().products().withKey({ key: productKey }).get().execute();
};

// Output the Product's current English name
const getBodyProduct = async (): Promise<void> => {
  returnProductByKey('tiger-head-balloon')
    .then(({ body }) => {
      console.log(body);
      console.log('1');
    })
    .catch(console.error);
  //body.masterData.current.name["en"]
};
const getProductName = async (): Promise<void> => {
  returnProductByKey('tiger-head-balloon')
    .then(({ body }) => {
      console.log(body.masterData.current.name['en-US']);
      console.log('2');
      return (objProd.name = body.masterData.current.name['en-US']);
    })
    .catch(console.error);
};

const getProductImg = async (): Promise<void> => {
  returnProductByKey('tiger-head-balloon')
    .then(({ body }) => {
      console.log(body.masterData.current.masterVariant.images[0].url);
      console.log('3');
      return (objProd.img = body.masterData.current.masterVariant.images[0].url);
    })
    .catch(console.error);
};
const getProductDescription = async (): Promise<void> => {
  returnProductByKey('tiger-head-balloon')
    .then(({ body }) => {
      console.log(body.masterData.current.metaDescription['en-US']);
      console.log('4');
      return (objProd.description = body.masterData.current.metaDescription['en-US']);
    })
    .catch(console.error);
  //body.masterData.current.name["en"]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProductss(): Promise<ProductProjection[]> {
  try {
    const request = await getApiRoot().productProjections().get().execute();
    const products = request.body.results;
    console.log(products);
    return products;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const add = async (objProd: Record<string, string>): Promise<void> => {
  // console.log(objProd)
  // console.log(objProd['description'])
  // console.log(objProd.name)
  // console.log(objProd.img)
  const img = document.createElement('div');
  img.className = 'img';
  img.style.backgroundImage = `url(${objProd.img})`;
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = objProd.name;
  const dis = document.createElement('div');
  dis.className = 'dis';
  dis.textContent = objProd.description;
  document.body.append(img);
  document.body.append(name);
  document.body.append(dis);
};
const update = async (): Promise<void> => {
  const q = await getBodyProduct();
  const w = await getProductName();
  const e = await getProductImg();
  const r = await getProductDescription();
  const g = await getProductss();
  console.log(objProd);
  const t = await add(objProd);
  q;
  w;
  e;
  r;
  g;
  t;
};

update();
