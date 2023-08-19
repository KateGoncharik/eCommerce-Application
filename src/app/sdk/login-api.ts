import { ClientBuilder } from '@commercetools/sdk-client-v2';
// думала их импортировать, но не находятся -> Client, TokenCache
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

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
  // tokenCache?: TokenCache; -> здесь не понимает, что за TokenCache (я тоже не понимаю что это)
  oauthUri?: string;
  fetch?: unknown;
};

const projectKey = 'wonderland';

export const withPasswordFlowClient = (email: string, password: string): (() => ByProjectKeyRequestBuilder) => {
  const options: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: projectKey,
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

  const getApiRoot: () => ByProjectKeyRequestBuilder = () => {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  };
  return getApiRoot;
};
