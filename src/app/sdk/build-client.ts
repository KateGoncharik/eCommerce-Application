import {
  ClientBuilder,
  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { projectKey, oauthUri, scopes, clientId, clientSecret, httpMiddlewareOptions } from '@sdk/params';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: oauthUri,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes,
  fetch,
};

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
