import { projectKey, scopes, oauthUri, clientId, clientSecret, apiHost, myTokenCache } from '@sdk/params';
import {
  PasswordAuthMiddlewareOptions,
  HttpMiddlewareOptions,
  AuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

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

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiHost,
  fetch,
};
const passwordAuthMiddlewareOptions = (email: string, password: string): PasswordAuthMiddlewareOptions => {
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
    tokenCache: myTokenCache,
    scopes: scopes,
    fetch,
  };
  return options;
};

const refreshAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
  host: oauthUri,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  refreshToken: myTokenCache.get().refreshToken || '',
  fetch,
};

const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: oauthUri,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  tokenCache: myTokenCache,
  scopes,
  fetch,
};

export {
  authMiddlewareOptions,
  httpMiddlewareOptions,
  passwordAuthMiddlewareOptions,
  refreshAuthMiddlewareOptions,
  anonymousAuthMiddlewareOptions,
};
