import { Burger } from '@components/burger';
import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getCart, changeLineItemQuantity } from '@sdk/requests';
import { Cart, LineItem } from '@commercetools/platform-sdk';
import { Route } from '@app/types/route';
import minus from '@icons/minus.png';
import addIcon from '@icons/add.png';
import { safeQuerySelector } from '@helpers/safe-query-selector';

class BasketPage extends Page {
  protected textObject = {
    title: 'Basket page',
  };

  private burger = new Burger();
  private createCart(cartContainer: HTMLElement): HTMLElement {
    return el('.cart', [el('h2.cart-title', 'Cart'), cartContainer]);
  }

  private minus = 'minus';
  private plus = 'plus';

  private createCartContainer(): HTMLElement {
    const cartContainer = el('.cart-container');
    getCart().then((userCart) => {
      if (userCart === null) {
        const noProductsWrapper = el('.no-items-wrapper', [
          el('p.no-items-message', 'No products added to cart. Take a look at our products here.'),
          el('a.no-items-link', this.burger.linkText.toCatalog, {
            href: Route.Catalog,
            'data-navigo': '',
          }),
        ]);
        mount(cartContainer, noProductsWrapper);
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

    const removeItem = el('img.remove-item', { src: minus, alt: 'remove' });
    removeItem.addEventListener('click', () => {
      this.removeItemFromCart(item.id);
      this.renderItemsAmount(this.minus);
    });
    const addItemImage = el('img.add-item', { src: addIcon, alt: 'add' });
    addItemImage.addEventListener('click', () => {
      this.addItem(item.id);
      this.renderItemsAmount(this.plus);
    });

    mount(
      productWrapper,
      el('.item', [
        el('.item-image-wrapper', [el('img.item-image', { src: images[0].url, alt: '' })]),
        el('.item-content', [
          el('.item-name', `${item.name['en-US']}`),
          el('.item-price', ` price: ${item.price.value.centAmount}`),
          el('.items-amount-wrapper', [
            el('.edit-item-quantity', [removeItem, el('.items-amount', `${item.quantity}`), addItemImage]),
          ]),
        ]),
        el('.item-total', [el('.total-price', ` total: ${item.totalPrice.centAmount}`)]),
      ])
    );
  }

  private async addItem(itemId: string): Promise<void> {
    const itemsAmountBlock = safeQuerySelector('.items-amount');
    let itemsAmount = Number(itemsAmountBlock.innerHTML);
    if (itemsAmount < 0) {
      return;
    }
    itemsAmount++;

    changeLineItemQuantity(itemId, itemsAmount);
  }

  private removeItemFromCart(itemId: string): void {
    const itemsAmountBlock = safeQuerySelector('.items-amount');
    let itemsAmount = Number(itemsAmountBlock.innerHTML);
    if (itemsAmount < 0) {
      return;
    }
    itemsAmount--;
    changeLineItemQuantity(itemId, itemsAmount);
  }

  private renderItemsAmount(operand: string): void {
    const itemsAmountBlock = safeQuerySelector('.items-amount');
    let itemsAmount = Number(itemsAmountBlock.innerHTML);
    if (itemsAmount < 0) {
      return;
    }
    if (operand === 'minus') {
      itemsAmount--;
    } else {
      itemsAmount++;
    }
    itemsAmountBlock.innerHTML = `${itemsAmount}`;
  }

  protected build(): HTMLElement {
    return this.createCart(this.createCartContainer());
  }
}

export { BasketPage };
