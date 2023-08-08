import { bindRoutes } from './router';
import { Page } from './templates/page';
import { MainPage } from './pages/catalog/main-page';
import { LoginPage } from './pages/service-pages/login-page';
import { RegistrationPage } from './pages/service-pages/registration-page';
import { NotFoundPage } from './pages/service-pages/404-page';

const main = document.createElement('main');
const routes: Record<string, Page> = {
  '/': new MainPage(),
  '/login': new LoginPage(),
  '/registration': new RegistrationPage(),
  '404': new NotFoundPage(),
};
const headerLinks: Record<string, string> = {
  Main: '/',
  Login: '/login',
  Registration: '/registration',
};

class App {
  public run(): void {
    const wrapper = this.build();
    document.body.append(wrapper);
    const pathname = window.location.pathname;
    bindRoutes(routes);
    const page = routes[pathname];
    page.render();
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    Object.keys(headerLinks).forEach((pageName) => {
      const link = document.createElement('a');
      link.href = headerLinks[pageName];
      link.dataset.navigo = '';
      link.textContent = pageName;
      header.append(link);
    });
    return header;
  }

  private build(): HTMLElement {
    const header = this.createHeader();
    const wrapper = document.createElement('div');
    wrapper.append(header, main);
    return wrapper;
  }
}

export { App, main };
