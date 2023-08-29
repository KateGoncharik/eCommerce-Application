import { el } from 'redom';
import { Route } from '@customTypes/route';
import logo from '@icons/logo-mini.png';
import cart from '@icons/cart.svg';
import { Burger } from '@components/burger';
import { UserState } from '@app/state';
class Header {
  private burger = new Burger();

  private userState = new UserState();

  public create(): HTMLElement {
    const loginOrLogoutLink = this.userState.isUserAuthorized()
      ? this.burger.createLogOutLink()
      : this.burger.createLogInLink();
    return el('header.header', [
      this.burger.mask,
      el('.header-big', [
        el('.header-column', [
          el('span.header-cell', [
            // TODO: use props of Burger class for elements in order to avoid duplication
            el('a', this.burger.linkText.toCatalog, {
              href: Route.Catalog,
              'data-navigo': '',
            }),
          ]),
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
}

export { Header };
