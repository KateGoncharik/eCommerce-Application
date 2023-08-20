import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { projectKey, scopes, oauthUri, clientId, clientSecret, httpMiddlewareOptions } from '@sdk/params';
import { PasswordAuthMiddlewareOptions, ClientBuilder } from '@commercetools/sdk-client-v2';

export const withPasswordFlowClient = (email: string, password: string): ByProjectKeyRequestBuilder => {
  const options: PasswordAuthMiddlewareOptions = {
    host: oauthUri,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      user: {
        username: email,
        password: password,
      },
    },
    scopes: scopes,
    fetch,
  };

  const newClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  return createApiBuilderFromCtpClient(newClient).withProjectKey({ projectKey });
};
