import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { TokenCache } from '@commercetools/sdk-client-v2';
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
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: unknown;
};
const projectKey = 'wonderland';
export const withPasswordFlowClient = (email: string, password: string): ByProjectKeyRequestBuilder => {
  const options: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: projectKey,
    credentials: {
      clientId: '2urgH4Xsd9iLmBZ8N4faM8fZ',
      clientSecret: 'gXkEffP_zxsBc-VmiabriuRmg6gX6Tzr',
      // clientId: CTP_CLIENT_ID,
      // clientSecret: CTP_CLIENT_SECRET,
      user: {
        username: email,
        password: password,
      },
    },
    scopes: [
      'manage_products:wonderland manage_customers:wonderland manage_my_orders:wonderland manage_states:wonderland manage_orders:wonderland manage_my_profile:wonderland manage_categories:wonderland create_anonymous_token:wonderland manage_shopping_lists:wonderland manage_discount_codes:wonderland manage_types:wonderland view_project_settings:wonderland manage_product_selections:wonderland manage_customer_groups:wonderland manage_my_shopping_lists:wonderland manage_order_edits:wonderland manage_cart_discounts:wonderland manage_shipping_methods:wonderland view_api_clients:wonderland introspect_oauth_tokens:wonderland',
    ],
    fetch,
  };
  const client = new ClientBuilder().withPasswordFlow(options).build();
  const getApiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  return getApiRoot;
};
