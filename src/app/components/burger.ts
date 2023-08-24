import { el } from 'redom';
import { Route } from '@customTypes/route';

class Burger {
  public linkText: Record<string, string> = {
    toMain: 'Home',
    toCatalog: 'Catalog',
    toAboutUs: 'About us',
    toLogIn: 'Log in',
    toLogOut: 'Log out',
    toJoin: 'Join',
  };
  public mask = el('.header-mask');

  public burgerIcon = this.createBurgerIcon();

  private mainPageLink = el('a.burger-link', this.linkText.toMain, {
    href: Route.Main,
    'data-navigo': '',
  });

  private catalogPageLink = el('a.burger-link', this.linkText.toCatalog, {
    href: Route.Catalog,
    'data-navigo': '',
  });

  private aboutUsPageLink = el('span.burger-link', this.linkText.toAboutUs);

  private logInPageLink = el('a.burger-link', this.linkText.toLogIn, {
    href: Route.Login,
    'data-navigo': '',
  });

  private joinPageLink = el('a.burger-link', this.linkText.toJoin, {
    href: Route.Registration,
    'data-navigo': '',
  });

  private createBurgerMenu(): HTMLElement {
    const burgerLinks = [
      this.mainPageLink,
      this.catalogPageLink,
      this.aboutUsPageLink,
      this.logInPageLink,
      this.joinPageLink,
    ];

    burgerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.toggleMenu();
      });
    });
    const separator = el('span', '/');
    const logInOrJoin = el('.burger-signin', [this.logInPageLink, separator, this.joinPageLink]);
    const burgerMenu = el('.burger-menu', [this.mainPageLink, this.catalogPageLink, this.aboutUsPageLink, logInOrJoin]);
    return burgerMenu;
  }

  public burgerMenu = this.createBurgerMenu();

  private createBurgerIcon(): HTMLElement {
    const burgerIcon = el('.burger', [el('span')]);
    burgerIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
    return burgerIcon;
  }

  private toggleMenu(): void {
    this.burgerIcon.classList.toggle('active');
    this.burgerMenu.classList.toggle('active');
    document.body.classList.toggle('lock');
    this.mask.classList.toggle('lock');
  }
}

export { Burger };
