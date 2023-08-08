import Navigo from 'navigo';
import Page from './templates/Page';

const router = new Navigo('/');

const navigate = (path: string, e?: Event): void => {
  if (e) {
    e.preventDefault();
  }
  history.pushState({}, '', path);
  router.navigate(path);
};

function bindRoutes(routes: { [key: string]: Page }): void {
  router
    .on('/', () => {
      const page = routes['/'];
      page.render();
      console.log('rendering...');
    })
    .on('/login', () => {
      const page = routes['/login'];
      page.render();
    })
    .on('/registration', () => {
      const page = routes['/registration'];
      page.render();
    })
    .resolve();
}

export { navigate, router, bindRoutes };
