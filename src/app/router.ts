import Navigo from 'navigo';
import { Page } from '@templates/page';
import { Route } from '@customTypes/route';
import { getUser } from './state';
import { CatalogPage } from '@catalog/catalog-page';
import { ProductPage } from '@catalog/product-page';

const router = new Navigo('/');

function bindRoutes(routes: Record<Route, Page>): void {
  router
    .on(Route.Main, () => {
      const page = routes[Route.Main];
      page.render();
    })
    .on(Route.Login, () => {
      const user = getUser();
      if (user) {
        router.navigate(Route.Main);
      } else {
        const page = routes[Route.Login];
        page.render();
      }
    })
    .on(Route.Registration, () => {
      const user = getUser();
      if (user) {
        router.navigate(Route.Main);
      } else {
        const page = routes[Route.Registration];
        page.render();
      }
    })
    .on(Route.Catalog, () => {
      const page = routes[Route.Catalog];
      page.render();
    })
    .on(Route.AboutUs, () => {
      const page = routes[Route.AboutUs];
      page.render();
    })
    .on(Route.UserPage, () => {
      const user = getUser();
      if (user) {
        const page = routes[Route.UserPage];
        page.render();
      } else {
        router.navigate(Route.Login);
      }
    })
    .on(Route.EditPasswordPage, () => {
      const user = getUser();
      if (user) {
        const page = routes[Route.EditPasswordPage];
        page.render();
      } else {
        router.navigate(Route.Login);
      }
    })
    .on(Route.AddAddressPage, () => {
      const user = getUser();
      if (user) {
        const page = routes[Route.AddAddressPage];
        page.render();
      } else {
        router.navigate(Route.Login);
      }
    })
    .on(Route.CartPage, () => {
      const page = routes[Route.CartPage]; //do we need it to work like that?
      page.render();
    })
    .on(/catalog\/.*product\/.+/, (path) => {
      const productKey = path?.url.split('/').pop() || '';
      const page = new ProductPage(productKey);
      page.render();
    })
    .on(/catalog\/(?!.+\/product\/)/, (path) => {
      const categoryKey = path?.url.split('/').pop() || '';
      const page = new CatalogPage(categoryKey);
      page.render();
    })
    .notFound(() => {
      const page = routes[Route.NotFound];
      page.render();
    })
    .resolve();
}

const redirect = (route: Route): void => router.navigate(route);

export { router, bindRoutes, redirect };
