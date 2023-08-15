import { getApiRoot } from '@sdk/build-client';

const getProject = async (): Promise<unknown> => {
  try {
    const project = await getApiRoot().get().execute();
    return project;
  } catch (e) {
    console.log(e);
  }
};

export { getProject };
