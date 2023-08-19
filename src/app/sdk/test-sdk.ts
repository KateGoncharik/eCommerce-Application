import { getApiRoot } from '@sdk/build-client';

type Data = {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: [
      {
        country: string;
        city: string;
        streetName: string;
        postalCode: string;
      },
      {
        country: string;
        city: string;
        streetName: string;
        postalCode: string;
      },
    ];
    defaultBillingAddress: number;
    defaultShippingAddress: number;
  };
};

const getProject = async (): Promise<unknown> => {
  try {
    const project = await getApiRoot().get().execute();
    return project;
  } catch (e) {
    console.log(e);
  }
};
// const testData = {
//   body: {
//     email: 'razumenko@gmail.com',
//     password: 'dwjdT4ddl',
//     firstName: 'gk',
//     lastName: 'dwj',
//     dateOfBirth: '1999-05-30',
//     addresses: [
//       {
//         // key: 'wonderland',
//         country: 'DE',
//         city: 'Franch',
//         streetName: 'dddd',
//         postalCode: '00000'
//       },
//       {
//         // key: 'wonderland',
//         country: 'DE',
//         city: 'Franch',
//         streetName: 'dddd',
//         postalCode: '00000'
//       },
//     ],
//     defaultBillingAddress: 0,
//     defaultShippingAddress: 1,
//   }

// }
const createUser = async (form: Data): Promise<unknown> => {
  try {
    const project = await getApiRoot().customers().post(form).execute();
    return project;
  } catch (e) {
    console.log(e);
  }
};
export { getProject, createUser };
