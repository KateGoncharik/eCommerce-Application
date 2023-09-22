import { el } from 'redom';
import { Route } from '@customTypes/route';
import { isUserAuthorized, logOutUser } from '@app/state';
import { router, redirect } from '@app/router';
import { renderHeader } from '@helpers/render-header';
import { LinkText } from '@app/types/enums';

class Burger {
  private mainPageLink = el('a.burger-link', LinkText.toMain, {
    href: Route.Main,
    'data-navigo': '',
  });

  private catalogPageLink = el('a.burger-link', LinkText.toCatalog, {
    href: Route.Catalog,
    'data-navigo': '',
  });

  private aboutUsPageLink = el('span.burger-link', LinkText.toAboutUs);

  private logInPageLink = el('a.burger-link', LinkText.toLogIn, {
    href: Route.Login,
    'data-navigo': '',
  });

  private joinPageLink = el('a.burger-link', LinkText.toJoin, {
    href: Route.Registration,
    'data-navigo': '',
  });

  private userPageLink = el('a.user-page-link.burger-link', LinkText.userPage, {
    href: Route.UserPage,
    'data-navigo': '',
  });

  public createLogInLink(): HTMLAnchorElement {
    return el('a', LinkText.toLogIn, {
      href: Route.Login,
      'data-navigo': '',
    });
  }

  public mask = el('.header-mask');

  public burgerIcon = this.createBurgerIcon();
  public burgerMenu = this.createBurgerMenu();

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
    this.changeUserPageBlockVisibility(this.userPageLink, this.userPageLink);
    return burgerMenu;
  }

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

  public createLogOutLink(): HTMLAnchorElement {
    const logOutLink = el('a.logout', LinkText.toLogOut, {
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

  public changeUserPageBlockVisibility(userPageBlock: HTMLElement, userPageLink: HTMLAnchorElement): void {
    if (isUserAuthorized()) {
      userPageBlock.style.display = 'flex';
      userPageLink.style.display = 'flex';
    }
  }
}

export { Burger };
