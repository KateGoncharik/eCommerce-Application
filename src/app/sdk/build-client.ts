import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

const projectKey = 'wonderland';
const oauthUri = 'https://auth.us-central1.gcp.commercetools.com';
const scopes = [
  'manage_products:wonderland manage_customers:wonderland manage_my_orders:wonderland manage_states:wonderland manage_orders:wonderland manage_my_profile:wonderland manage_categories:wonderland create_anonymous_token:wonderland manage_shopping_lists:wonderland manage_discount_codes:wonderland manage_types:wonderland view_project_settings:wonderland manage_product_selections:wonderland manage_customer_groups:wonderland manage_my_shopping_lists:wonderland manage_order_edits:wonderland manage_cart_discounts:wonderland manage_shipping_methods:wonderland view_api_clients:wonderland introspect_oauth_tokens:wonderland',
];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: oauthUri,
  projectKey: projectKey,
  credentials: {
    clientId: '2urgH4Xsd9iLmBZ8N4faM8fZ',
    clientSecret: 'gXkEffP_zxsBc-VmiabriuRmg6gX6Tzr',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.us-central1.gcp.commercetools.com',
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

export { projectKey, ctpClient, getApiRoot };
