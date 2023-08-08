import Navigo from 'navigo';
import { Page } from './templates/page';

const router = new Navigo('/');

function bindRoutes(routes: Record<string, Page>): void {
  router
    .on('/', () => {
      const page = routes['/'];
      page.render();
    })
    .on('/login', () => {
      const page = routes['/login'];
      page.render();
    })
    .on('/registration', () => {
      const page = routes['/registration'];
      page.render();
    })
    .notFound(() => {
      const page = routes['404'];
      page.render();
    })
    .resolve();
}

export { router, bindRoutes };
