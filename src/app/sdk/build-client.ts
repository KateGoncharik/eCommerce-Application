import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { projectKey, myTokenCache } from '@sdk/params';
import {
  authMiddlewareOptions,
  httpMiddlewareOptions,
  refreshAuthMiddlewareOptions,
  anonymousAuthMiddlewareOptions,
} from '@sdk/middlewares';

const defaultClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const anonymousClient = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const clientWithRefreshTokenFlow = new ClientBuilder()
  .withRefreshTokenFlow(refreshAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const getApiRoot = (client = defaultClient): ByProjectKeyRequestBuilder => {
  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
};

const getApiRootForCartRequests = (): ByProjectKeyRequestBuilder => {
  const IsTokenInCache = myTokenCache.get().token !== '';
  const client = IsTokenInCache ? clientWithRefreshTokenFlow : anonymousClient;
  return getApiRoot(client);
};

export { getApiRoot, getApiRootForCartRequests };
