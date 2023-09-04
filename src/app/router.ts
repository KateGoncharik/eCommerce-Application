import Navigo from 'navigo';
import { Page } from '@templates/page';
import { Route } from '@customTypes/route';
import { getUser } from './state';
import { CatalogPage } from '@catalog/catalog-page';

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
    .on(Route.ProductPage, () => {
      const page = routes[Route.ProductPage];
      page.render();
    })
    .on(Route.UserPage, () => {
      const user = getUser();
      if (user) {
        const page = routes[Route.UserPage];
        page.render();
      } else {
        router.navigate(Route.Main);
      }
    })
    .on(/catalog\/.+/, (path) => {
      const categoryKey = path?.url.split('/').pop();
      if (CatalogPage.current) {
        CatalogPage.current.categoryKey = categoryKey;
        CatalogPage.current.updateProductsContainer();
      } else {
        const page = new CatalogPage(categoryKey);
        page.render();
      }
    })
    .notFound(() => {
      const page = routes[Route.NotFound];
      page.render();
    })
    .resolve();
}

const redirect = (route: Route): void => router.navigate(route);

export { router, bindRoutes, redirect };
