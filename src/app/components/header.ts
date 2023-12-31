import { el } from 'redom';
import { Route } from '@customTypes/route';
import logo from '@icons/logo-mini.png';
import cart from '@icons/cart.svg';
import { Burger } from '@components/burger';
import { isUserAuthorized } from '@app/state';
import { getCart } from '@app/sdk/requests';
import { updateHeaderItemsAmount } from '@helpers/update-counter-items-amount';
import { LinkText } from '@app/types/enums';

class Header {
  private burger = new Burger();

  public create(): HTMLElement {
    const loginOrLogoutLink = isUserAuthorized() ? this.burger.createLogOutLink() : this.burger.createLogInLink();
    const userPageLink = el('a.user-page-link.burger-link', LinkText.userPage, {
      href: Route.UserPage,
      'data-navigo': '',
    });
    if (!(userPageLink instanceof HTMLAnchorElement)) {
      throw new Error('Link expected');
    }
    const userPageBlock = el('.header-cell.user-page-link-block', [userPageLink]);
    this.burger.changeUserPageBlockVisibility(userPageBlock, userPageLink);
    const itemsInCart = el('.header-items-amount', `0`);
    const itemsInCartForMobile = el('.header-items-amount-mobile', `0`);
    const cartLink = el('a', LinkText.cart, {
      href: Route.CartPage,
      'data-navigo': '',
    });
    getCart().then((cart) => {
      if (cart === null) {
        return;
      }
      updateHeaderItemsAmount(cart);
    });

    return el('header.header', [
      this.burger.mask,
      el('.header-big', [
        el('.header-column', [
          el('span.header-cell', [
            // TODO: use props of Burger class for elements in order to avoid duplication
            el('a', LinkText.toCatalog, {
              href: Route.Catalog,
              'data-navigo': '',
            }),
          ]),
          el('span.header-cell', [
            el('a', LinkText.toAboutUs, {
              href: Route.AboutUs,
              'data-navigo': '',
            }),
          ]),
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
            el('a', LinkText.toJoin, {
              href: Route.Registration,
              'data-navigo': '',
            }),
          ]),
          userPageBlock,
          el('.header-cell', [cartLink, itemsInCart]),
        ]),
      ]),
      el('.header-small', [
        el('.header-small-cell', [this.burger.burgerIcon]),
        el('.header-cart.header-small-cell.top', [
          el(
            'a',
            {
              href: Route.CartPage,
              'data-navigo': '',
            },
            [
              el('img', {
                src: cart,
              }),
              itemsInCartForMobile,
            ]
          ),
        ]),
      ]),
      this.burger.burgerMenu,
    ]);
  }
}

export { Header };
