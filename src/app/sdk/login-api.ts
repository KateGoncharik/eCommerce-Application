import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { projectKey } from '@sdk/params';
import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { passwordAuthMiddlewareOptions, httpMiddlewareOptions } from '@sdk/middlewares';

export const withPasswordFlowClient = (email: string, password: string): ByProjectKeyRequestBuilder => {
  const options = passwordAuthMiddlewareOptions(email, password);

  const newClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  return createApiBuilderFromCtpClient(newClient).withProjectKey({ projectKey });
};
