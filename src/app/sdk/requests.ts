import { getApiRoot } from '@sdk/build-client';

export async function isUserExist(email: string): Promise<boolean> {
  const result = await getApiRoot()
    .customers()
    .get({ queryArgs: { where: `email="${email}"` } })
    .execute();
  return result.body.count > 0;
}
