import { getApiRoot } from '@sdk/build-client';
import { DataUser } from '@sdk/type';

const getProject = async (): Promise<unknown> => {
  try {
    const project = await getApiRoot().get().execute();
    return project;
  } catch (err) {
    console.log(err);
  }
};

const createUser = async (form: DataUser): Promise<unknown> => {
  try {
    const project = await getApiRoot().customers().post(form).execute();
    return project;
  } catch (err) {
    console.log(err);
  }
};
export { getProject, createUser };
