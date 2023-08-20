import { getApiRoot } from '@sdk/build-client';
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
