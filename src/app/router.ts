import Navigo from 'navigo';
import { Page } from '@templates/page';
import { Route } from '@customTypes/route';
import { getUser } from './state';

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
      const page = routes[Route.Registration];
      page.render();
    })
    .on(Route.Catalog, () => {
      const page = routes[Route.Catalog];
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
    .notFound(() => {
      const page = routes[Route.NotFound];
      page.render();
    })
    .resolve();
}

const redirect = (route: Route): void => router.navigate(route);

export { router, bindRoutes, redirect };
