import { el } from 'redom';
import { Route } from '@customTypes/route';
import logo from '@icons/logo-mini.png';
import cart from '@icons/cart.svg';
import { Burger } from '@components/burger';
import { isUserAuthorized } from '@app/state';
class Header {
  private burger = new Burger();

  public create(): HTMLElement {
    const loginOrLogoutLink = isUserAuthorized() ? this.burger.createLogOutLink() : this.burger.createLogInLink();
    const userPageLink = el('a.user-page-link.burger-link', this.burger.linkText.userPage, {
      href: Route.UserPage,
      'data-navigo': '',
    });
    if (!(userPageLink instanceof HTMLAnchorElement)) {
      throw new Error('Link expected');
    }
    const userPageBlock = el('.header-cell.user-page-link-block', [userPageLink]);
    this.burger.changeUserPageBlockVisability(userPageBlock, userPageLink);
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
          userPageBlock,
          el('span.header-cell', [
            el('a', this.burger.linkText.cart, {
              href: Route.BasketPage,
              'data-navigo': '',
            }),
          ]),
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
