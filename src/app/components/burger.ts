import { el } from 'redom';
import { Route } from '@customTypes/route';
import { isUserAuthorized, logOutUser } from '@app/state';
import { router, redirect } from '@app/router';
import { renderHeader } from '@helpers/render-header';

class Burger {
  public linkText: Record<string, string> = {
    toMain: 'Home',
    toCatalog: 'Catalog',
    toAboutUs: 'About us',
    toLogIn: 'Log in',
    toLogOut: 'Log out',
    toJoin: 'Join',
    userPage: 'User page',
    cart: 'Cart',
  };

  public mask = el('.header-mask');

  public burgerIcon = this.createBurgerIcon();

  public createLogOutLink(): HTMLAnchorElement {
    const logOutLink = el('a.logout', this.linkText.toLogOut, {
      href: '/logout',
      'data-navigo': '',
    });

    if (!(logOutLink instanceof HTMLAnchorElement)) {
      throw new Error();
    }

    logOutLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      logOutUser();

      redirect(Route.Login);
      renderHeader();
      router.updatePageLinks();
    });

    return logOutLink;
  }

  public createLogInLink(): HTMLAnchorElement {
    return el('a', this.linkText.toLogIn, {
      href: Route.Login,
      'data-navigo': '',
    });
  }

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

  private userPageLink = el('a.user-page-link.burger-link', this.linkText.userPage, {
    href: Route.UserPage,
    'data-navigo': '',
  });

  public changeUserPageBlockVisability(userPageBlock: HTMLElement, userPageLink: HTMLAnchorElement): void {
    if (isUserAuthorized()) {
      userPageBlock.style.display = 'flex';
      userPageLink.style.display = 'flex';
    }
  }

  private createBurgerMenu(): HTMLElement {
    const loginOrLogoutLink = isUserAuthorized() ? this.createLogOutLink() : this.createLogInLink();
    const burgerLinks = [
      this.mainPageLink,
      this.catalogPageLink,
      this.aboutUsPageLink,
      this.userPageLink,
      this.logInPageLink,
      this.joinPageLink,
    ];

    burgerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.toggleMenu();
      });
    });
    const separator = el('span', '/');
    const logInOrJoin = el('.burger-signin', [loginOrLogoutLink, separator, this.joinPageLink]);
    const burgerMenu = el('.burger-menu', [
      this.mainPageLink,
      this.catalogPageLink,
      this.aboutUsPageLink,
      this.userPageLink,
      logInOrJoin,
    ]);
    if (!(this.userPageLink instanceof HTMLAnchorElement)) {
      throw new Error('Link expected');
    }
    this.changeUserPageBlockVisability(this.userPageLink, this.userPageLink);
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
