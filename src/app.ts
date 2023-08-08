import { navigate, bindRoutes } from './router';
import Page from './templates/Page';
import MainPage from './pages/catalog/main-page';
import { LoginPage } from './pages/service-pages/login-page';
import { RegistrationPage } from './pages/service-pages/registration-page';

const main = document.createElement('main');
const routes: { [key: string]: Page } = {
  '/': new MainPage(),
  '/login': new LoginPage(),
  '/registration': new RegistrationPage(),
};
const headerLinks: { [key: string]: string } = {
  Main: '/',
  Login: '/login',
  Registration: '/registration',
};

class App {
  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    Object.keys(headerLinks).forEach((pageName) => {
      const link = document.createElement('a');
      link.href = headerLinks[pageName];
      link.dataset.navigo = '';
      link.textContent = pageName;
      link.addEventListener('click', (e) => {
        const route = headerLinks[pageName];
        navigate(route, e);
      });
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
  public run(): void {
    bindRoutes(routes);
    const wrapper = this.build();
    document.body.append(wrapper);
    const pathname = window.location.pathname;
    const page = routes[pathname];
    page.render();
  }
}

export { App, main };
