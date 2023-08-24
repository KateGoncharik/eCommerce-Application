import { el } from 'redom';
import { Route } from '@customTypes/route';
import logo from '@icons/logo-mini.png';
import cart from '@icons/cart.svg';
import { Burger } from '@components/burger';
import { isUserAuthorized, logOutUser } from '@app/state';
import { router } from '@app/router';
import { renderHeader } from '@helpers/render-header';
class Header {
  private burger = new Burger();
  public create(): HTMLElement {
    const loginOrLogoutLink = isUserAuthorized() ? this.createLogOutLink() : this.createLogInLink();
    return el('header.header', [
      this.burger.mask,
      el('.header-big', [
        el('.header-column', [
          el('span.header-cell', this.burger.linkText.toCatalog),
          el('span.header-cell', this.burger.linkText.toAboutUs),
        ]),
        el(
          '.header-column.logo-column',
          el(
            'a.header-logo',
            {
              href: Route.Main,
              'data-navigo': '',
            },
            [
              el('img', {
                src: logo,
              }),
            ]
          )
        ),
        el('.header-column', [
          el('.header-cell.login-cell', [
            loginOrLogoutLink,
            el('span', '/'),
            el('a', this.burger.linkText.toJoin, {
              href: Route.Registration,
              'data-navigo': '',
            }),
          ]),
          el('span.header-cell', 'Cart'),
        ]),
      ]),
      el('.header-small', [
        el('.header-small-cell', [this.burger.burgerIcon]),
        el('.header-cart.header-small-cell', [
          el('img', {
            src: cart,
          }),
        ]),
      ]),
      this.burger.burgerMenu,
    ]);
  }

  private createLogOutLink(): HTMLAnchorElement {
    const logOutLink = el('a.logout', this.burger.linkText.toLogOut, {
      //TODO we should use Route here, but each route bound to a real page, and we don't need this
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

      router.navigate(Route.Login);
      renderHeader();
    });

    return logOutLink;
  }

  private createLogInLink(): HTMLAnchorElement {
    return el('a', this.burger.linkText.toLogIn, {
      href: Route.Login,
      'data-navigo': '',
    });
  }
}

export { Header };
