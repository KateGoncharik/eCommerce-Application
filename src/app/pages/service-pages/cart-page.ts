import { Burger } from '@components/burger';
import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getCart, updateLineItemQuantity, recalculateCartCost } from '@sdk/requests';
import { Cart, LineItem } from '@commercetools/platform-sdk';
import { Route } from '@app/types/route';
import { toggleIconsState } from '@helpers/toggle-icons-state';
import { getPriceInUsd } from '@helpers/get-price-in-usd';
import minus from '@icons/minus.png';
import addIcon from '@icons/add.png';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { updateItemsAmount } from '@helpers/update-items-amount';

class CartPage extends Page {
  protected textObject = {
    title: 'Cart page',
  };

  private burger = new Burger();
  private createCart(cartContainer: HTMLElement): HTMLElement {
    return el('.cart', [el('h2.cart-title', 'Cart'), cartContainer]);
  }

  static getItemsQuantity(itemsAmountBlock: HTMLElement): number {
    const itemsAmount = Number(itemsAmountBlock.innerHTML);
    if (itemsAmount >= 1) {
      return itemsAmount;
    }
    throw new Error('Positive items amount expected');
  }

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
        this.fillCartContainer(userCart, cartContainer);
      }
    });
    return cartContainer;
  }

  private fillCartContainer(cart: Cart, cartContainer: HTMLElement): void {
    const cartItems = el('.cart-items');
    cartContainer.innerHTML = '';
    cart.lineItems.forEach((item) => {
      this.createProductCard(item, cartItems);
    });
    const checkout = el('.checkout', [
      el('span.checkout-title', 'Order details'),
      el('.checkout-total-price', `Total price: ${getPriceInUsd(cart.totalPrice.centAmount)}`),
      el('.checkout-items-amount', `Products in cart: ${cart.totalLineItemQuantity}`),
    ]);
    mount(cartContainer, cartItems);
    mount(cartContainer, checkout);
  }

  private createProductCard(item: LineItem, productWrapper: HTMLElement): void {
    const images = item.variant.images;
    if (!images) {
      throw new Error('Images expected');
    }

    const itemsAmountBlock = el('.items-amount', `${item.quantity}`);
    const itemTotalCostBlock = el('.item-total', [
      el('.total-price', ` total: ${getPriceInUsd(item.totalPrice.centAmount)}`),
    ]);
    const removeItemButton = el('button.remove-item-button', [el('img.remove-item', { src: minus, alt: 'remove' })]);
    if (!(removeItemButton instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    const addItemButton = el('button.add-item-button', [el('img.add-item', { src: addIcon, alt: 'add' })]);
    if (!(addItemButton instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    removeItemButton.addEventListener('click', () => {
      this.removeFromCart(item.id, itemsAmountBlock, itemTotalCostBlock, removeItemButton, addItemButton);
      const itemsAmount = CartPage.getItemsQuantity(itemsAmountBlock);
      if (itemsAmount === 1) {
        return;
      }
      const newAmount = this.decreaseItemsAmount(itemsAmount);
      itemsAmountBlock.innerHTML = `${newAmount}`;
    });
    addItemButton.addEventListener('click', () => {
      this.addToCart(item.id, itemsAmountBlock, itemTotalCostBlock, addItemButton, removeItemButton);
      const newAmount = this.increaseItemsAmount(CartPage.getItemsQuantity(itemsAmountBlock));
      itemsAmountBlock.innerHTML = `${newAmount}`; //TODO refactor - remove duplication
    });
    mount(
      productWrapper,
      el('.item', [
        el('.item-image-wrapper', [el('img.item-image', { src: images[0].url, alt: '' })]),
        el('.item-content', [
          el('.item-name', `${item.name['en-US']}`),
          el('.item-price', ` price: ${getPriceInUsd(item.price.value.centAmount)}`),
          el('.items-amount-wrapper', [el('.edit-item-quantity', [removeItemButton, itemsAmountBlock, addItemButton])]),
        ]),
        itemTotalCostBlock,
      ])
    );
  }

  private async addToCart(
    itemId: string,
    itemsAmountBlock: HTMLElement,
    itemTotalCostBlock: HTMLElement,
    addIcon: HTMLButtonElement,
    removeIcon: HTMLButtonElement
  ): Promise<void> {
    let itemsAmount = CartPage.getItemsQuantity(itemsAmountBlock);
    itemsAmount++;
    toggleIconsState([removeIcon, addIcon]);
    this.updateQuantityAndCost(itemId, itemsAmount, itemTotalCostBlock, removeIcon, addIcon);
  }

  private removeFromCart(
    itemId: string,
    itemsAmountBlock: HTMLElement,
    itemTotalCostBlock: HTMLElement,
    removeIcon: HTMLButtonElement,
    addIcon: HTMLButtonElement
  ): void {
    let itemsAmount = CartPage.getItemsQuantity(itemsAmountBlock);
    if (itemsAmount === 1) {
      return;
    }
    itemsAmount--;
    toggleIconsState([removeIcon, addIcon]);
    this.updateQuantityAndCost(itemId, itemsAmount, itemTotalCostBlock, removeIcon, addIcon);
  }

  private updateQuantityAndCost(
    itemId: string,
    itemsAmount: number,
    itemTotalCostBlock: HTMLElement,
    removeIcon: HTMLButtonElement,
    addIcon: HTMLButtonElement
  ): void {
    updateLineItemQuantity(itemId, itemsAmount).then(() => {
      recalculateCartCost()
        .then((updatedCart) => {
          if (updatedCart === null) {
            throw new Error('Recalculate failure');
          }
          const item = updatedCart.lineItems.find((item) => item.id === itemId);
          if (!item) {
            throw new Error('No such product found in cart');
          }

          this.updateOrderDetails(updatedCart.totalPrice.centAmount, updatedCart.lineItems.length);
          itemTotalCostBlock.innerHTML = `total: ${getPriceInUsd(item.totalPrice.centAmount)}`;
          updateItemsAmount(updatedCart);
        })
        .finally(() => {
          toggleIconsState([removeIcon, addIcon]);
        });
    });
  }

  private increaseItemsAmount(itemsAmount: number): number {
    return (itemsAmount += 1);
  }

  private decreaseItemsAmount(itemsAmount: number): number {
    if (itemsAmount <= 1) {
      throw new Error('Item expected');
    }
    return (itemsAmount -= 1);
  }

  private updateOrderDetails(updatedCost: number, updatedAmount: number): void {
    safeQuerySelector('.checkout-total-price', document).innerHTML = `Total price: ${getPriceInUsd(updatedCost)}`;
    safeQuerySelector('.checkout-items-amount', document).innerHTML = `Products in cart: ${updatedAmount}`;
  }

  protected build(): HTMLElement {
    return this.createCart(this.createCartContainer());
  }
}

export { CartPage };
