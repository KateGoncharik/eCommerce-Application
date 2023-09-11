import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getUserCart } from '@sdk/requests';
import { Cart, LineItem } from '@commercetools/platform-sdk';

class BasketPage extends Page {
  protected textObject = {
    title: 'Basket page',
  };

  private createCart(cartContainer: HTMLElement): HTMLElement {
    return el('.cart', [el('h2.cart-title', 'Cart'), cartContainer]);
  }

  private createCartContainer(): HTMLElement {
    const cartContainer = el('.cart-container');
    getUserCart().then((userCart) => {
      if (userCart === null) {
        cartContainer.innerHTML = 'No products added to cart';
      } else {
        this.fillCartInfoBlock(userCart, cartContainer);
      }
    });
    return cartContainer;
  }

  private fillCartInfoBlock(cart: Cart, cartContainer: HTMLElement): void {
    const cartItems = el('.cart-items');
    cartContainer.innerHTML = '';
    cart.lineItems.forEach((item) => {
      this.createProductCard(item, cartItems);
    });
    const checkout = el('.checkout', [
      el('span.checkout-title', 'Order details'),
      el('.checkout-total-price', `Total price: ${cart.totalPrice.centAmount} cents`),
      el('.checkout-items-amount', `Products in cart: ${cart.lineItems.length}`),
    ]);
    mount(cartContainer, cartItems);
    mount(cartContainer, checkout);
  }

  private createProductCard(item: LineItem, productWrapper: HTMLElement): void {
    const images = item.variant.images;
    if (!images) {
      throw new Error('Images expected');
    }
    mount(
      productWrapper,
      el('.item', [
        el('.item-image-wrapper', [el('img.item-image', { src: images[0].url, alt: '' })]),
        el('.item-content', [
          el('.item-name', `${item.name['en-US']}`),
          el('.item-price', ` price: ${item.price.value.centAmount}`),

          el('.items-amount', `${item.quantity}`),
        ]),
        el('.item-total', [el('.total-price', ` total: ${item.totalPrice.centAmount}`)]),
      ])
    );
  }

  protected build(): HTMLElement {
    return this.createCart(this.createCartContainer());
  }
}

export { BasketPage };
