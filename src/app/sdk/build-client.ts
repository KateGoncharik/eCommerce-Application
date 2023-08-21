import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { projectKey, httpMiddlewareOptions } from '@sdk/params';
import { authMiddlewareOptions } from '@sdk/middlewares';

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

const getApiRoot: () => ByProjectKeyRequestBuilder = () => {
  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
};

export { ctpClient, getApiRoot };
