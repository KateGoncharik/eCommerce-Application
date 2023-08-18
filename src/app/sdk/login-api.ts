import { ClientBuilder } from '@commercetools/sdk-client-v2';

type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: unknown;
};
export const withPasswordFlowClient = (email: string, password: string): Client => {
  const options: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'wonderland',
    credentials: {
      clientId: '2urgH4Xsd9iLmBZ8N4faM8fZ',
      clientSecret: 'gXkEffP_zxsBc-VmiabriuRmg6gX6Tzr',
      user: {
        username: email,
        password,
      },
    },
    scopes: [`manage_project:wonderland`],
    fetch,
  };

  const client = new ClientBuilder().withPasswordFlow(options).build();
  return client;
};
