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

const createUser = async (form: Data): Promise<unknown> => {
  try {
    const project = await getApiRoot().customers().post(form).execute();
    return project;
  } catch (e) {
    console.log(e);
  }
};
export { getProject, createUser };
