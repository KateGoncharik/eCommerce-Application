import { bindRoutes } from './router';
import { Route } from './types/route';
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

class App {
  public run(): void {
    const wrapper = this.build();
    document.body.append(wrapper);
    bindRoutes(routes);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    for (const [pageName, pageLink] of Object.entries(Route)) {
      const link = document.createElement('a');
      link.href = pageLink;
      link.dataset.navigo = '';
      link.textContent = pageName;
      header.append(link);
    }
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
