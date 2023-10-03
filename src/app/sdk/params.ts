import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

const projectKey = 'wonderland-2';

const scopes = [
  'manage_product_selections:wonderland-2 manage_discount_codes:wonderland-2 manage_shipping_methods:wonderland-2 manage_products:wonderland-2 manage_customers:wonderland-2 create_anonymous_token:wonderland-2 manage_states:wonderland-2 manage_payments:wonderland-2 manage_my_orders:wonderland-2 manage_orders:wonderland-2 manage_my_payments:wonderland-2 view_project_settings:wonderland-2 manage_my_profile:wonderland-2 manage_categories:wonderland-2 manage_my_shopping_lists:wonderland-2 introspect_oauth_tokens:wonderland-2 manage_order_edits:wonderland-2 manage_cart_discounts:wonderland-2 manage_customer_groups:wonderland-2 view_api_clients:wonderland-2 manage_shopping_lists:wonderland-2 manage_types:wonderland-2',
];

const clientId = 'k9LNkK0ruKP5wYUAWvBh4k-t';
const clientSecret = 'C0vU6pLH9IYJzCV8xXiibdSt0vqxzp9H';

const apiHost = 'https://api.us-central1.gcp.commercetools.com';
const oauthUri = 'https://auth.us-central1.gcp.commercetools.com';

const myTokenCache: TokenCache = {
  get(): TokenStore {
    const savedStore = localStorage.getItem('tokenStore');
    if (!savedStore) {
      return {
        token: '',
        expirationTime: 0,
        refreshToken: '',
      };
    }
    return JSON.parse(savedStore);
  },

  set(cache: TokenStore): void {
    localStorage.setItem('tokenStore', JSON.stringify(cache));
  },
};

export { projectKey, oauthUri, scopes, clientId, clientSecret, apiHost, myTokenCache };
