export type DataUser = {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: [
      {
        //billing
        country: string;
        city: string;
        streetName: string;
        postalCode: string;
      },
      {
        //shipping
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
