import Navigo from 'navigo';
import { Page } from './templates/page';
import { Route } from './types/route';

const router = new Navigo('/');

function bindRoutes(routes: Record<string, Page>): void {
  router
    .on(Route.Main, () => {
      const page = routes[Route.Main];
      page.render();
    })
    .on(Route.Login, () => {
      const page = routes[Route.Login];
      page.render();
    })
    .on(Route.Registration, () => {
      const page = routes[Route.Registration];
      page.render();
    })
    .notFound(() => {
      const page = routes['404'];
      page.render();
    })
    .resolve();
}

export { router, bindRoutes };
