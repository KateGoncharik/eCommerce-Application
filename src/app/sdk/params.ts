import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

const projectKey = 'wonderland';

const scopes = [
  'manage_products:wonderland manage_customers:wonderland manage_my_orders:wonderland manage_states:wonderland manage_orders:wonderland manage_my_profile:wonderland manage_categories:wonderland create_anonymous_token:wonderland manage_shopping_lists:wonderland manage_discount_codes:wonderland manage_types:wonderland view_project_settings:wonderland manage_product_selections:wonderland manage_customer_groups:wonderland manage_my_shopping_lists:wonderland manage_order_edits:wonderland manage_cart_discounts:wonderland manage_shipping_methods:wonderland view_api_clients:wonderland introspect_oauth_tokens:wonderland',
];

const clientId = '2urgH4Xsd9iLmBZ8N4faM8fZ';
const clientSecret = 'gXkEffP_zxsBc-VmiabriuRmg6gX6Tzr';

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
