import { projectKey, scopes, oauthUri, clientId, clientSecret, apiHost } from '@sdk/params';
import {
  PasswordAuthMiddlewareOptions,
  HttpMiddlewareOptions,
  AuthMiddlewareOptions,
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
    scopes: scopes,
    fetch,
  };
  return options;
};

export { authMiddlewareOptions, httpMiddlewareOptions, passwordAuthMiddlewareOptions };
