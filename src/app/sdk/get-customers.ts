// import { getApiRoot } from '@sdk/build-client';

const getCustomers = async (): Promise<unknown> => {
  // try {
  //   const project = await getApiRoot().customers().get().execute();
  //   return project;
  // } catch (e) {
  //   console.log(e);
  // }
  const promise = new Promise(function (resolve) {
    setTimeout(() => resolve('done'), 1000);
  });
  return promise;
};

export { getCustomers };
