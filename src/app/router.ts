import Navigo from 'navigo';
import { Page } from '@templates/page';
import { Route } from '@customTypes/route';

const router = new Navigo('/');

function bindRoutes(routes: Record<Route, Page>): void {
  router
    .on(Route.Main, () => {
      const page = routes[Route.Main];
      page.render();
    })
    .on(Route.Login, () => {
      const user = localStorage.getItem('user');
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
    .notFound(() => {
      const page = routes[Route.NotFound];
      page.render();
    })
    .resolve();
}

const redirectOnMain = (): void => router.navigate(Route.Main);

export { router, bindRoutes, redirectOnMain };
