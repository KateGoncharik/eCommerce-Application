import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { scopes, httpMiddlewareOptions } from '@sdk/build-client';
import { ClientBuilder } from '@commercetools/sdk-client-v2';
const projectKey = 'wonderland';

export const withPasswordFlowClient = (email: string, password: string): ByProjectKeyRequestBuilder => {
  const options: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.us-central1.gcp.commercetools.com',
    projectKey: projectKey,
    credentials: {
      clientId: '2urgH4Xsd9iLmBZ8N4faM8fZ',
      clientSecret: 'gXkEffP_zxsBc-VmiabriuRmg6gX6Tzr',
      user: {
        username: email,
        password: password,
      },
    },
    scopes: scopes,
    fetch,
  };

  console.log(options);
  const newClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  return createApiBuilderFromCtpClient(newClient).withProjectKey({ projectKey });
};
