import { bindRoutes } from './router';
import { Route } from '@customTypes/route';
import { Page } from '@templates/page';
import { MainPage } from '@pages/main-page';
import { LoginPage } from '@servicePages/login-page';
import { RegistrationPage } from '@servicePages/registration-page';
import { NotFoundPage } from '@servicePages/404-page';
import { CatalogPage } from '@catalog/catalog-page';
import { UserPage } from '@servicePages/user-profile';
import { Header } from '@components/header';

const main = document.createElement('main');
const routes: Record<Route, Page> = {
  [Route.Main]: new MainPage(),
  [Route.Login]: new LoginPage(),
  [Route.Registration]: new RegistrationPage(),
  [Route.NotFound]: new NotFoundPage(),
  [Route.Catalog]: new CatalogPage(),
  [Route.UserPage]: new UserPage(),
};

class App {
  public run(): void {
    const wrapper = this.build();
    document.body.append(wrapper);
    bindRoutes(routes);
  }

  private createHeader(): HTMLElement {
    return new Header().create();
  }

  private build(): HTMLElement {
    const header = this.createHeader();
    const wrapper = document.createElement('div');
    wrapper.append(header, main);
    return wrapper;
  }
}

export { App, main };
