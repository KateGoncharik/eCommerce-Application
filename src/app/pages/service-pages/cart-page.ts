import { Page } from '@templates/page';
import { Burger } from '@components/burger';
import { el, mount, setChildren, unmount } from 'redom';
import { Cart, LineItem } from '@commercetools/platform-sdk';
import {
  getCart,
  updateLineItemQuantity,
  recalculateCartCost,
  deleteProductFromCart,
  getPromocodes,
  getPromocodeById,
  addPromocodeToCart,
} from '@sdk/requests';
import { Route } from '@app/types/route';
import { getAllItemsRemoveActions, getRemoveItemAction } from '@helpers/get-actions';
import { getPriceInUsd } from '@helpers/get-price-in-usd';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { toggleIconsState } from '@helpers/toggle-icons-state';
import { updateHeaderItemsAmount } from '@helpers/update-counter-items-amount';
import minus from '@icons/minus.png';
import addIconSrc from '@icons/add.png';
import trashCan from '@icons/trash-can.png';

class CartPage extends Page {
  private burger = new Burger();

  protected textObject = {
    title: 'Cart page',
  };

  private createCart(cartContainer: HTMLElement): HTMLElement {
    return el('.cart', [el('h2.cart-title', 'Cart'), cartContainer]);
  }

  private createNoProductsContainer(cartContainer: HTMLElement): void {
    const noProductsWrapper = el('.no-items-wrapper', [
      el('p.no-items-message', 'No products added to cart. Take a look at our products here.'),
      el('a.no-items-link', this.burger.linkText.toCatalog, {
        href: Route.Catalog,
        'data-navigo': '',
      }),
    ]);
    mount(cartContainer, noProductsWrapper);
  }

  private createCartContainer(): HTMLElement {
    const cartContainer = el('.cart-container');
    getCart().then((userCart) => {
      if (userCart === null || !userCart.totalLineItemQuantity) {
        this.createNoProductsContainer(cartContainer);
      } else {
        this.fillCartContainer(userCart, cartContainer);
      }
    });
    return cartContainer;
  }

  private fillCartContainer(cart: Cart, cartContainer: HTMLElement): void {
    const cartItems = el('.cart-items');
    const clearCartButton = el('button.clear-cart-button', 'Clear cart');
    const orderCartButton = el('button.order-button', 'Order');
    if (!(clearCartButton instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    const totalCartPrice = el('div', this.createTotalCartPriceBlock(cart));

    clearCartButton.addEventListener('click', async () => {
      const isClearCart = confirm('Clear cart?');
      if (!isClearCart) {
        return;
      }
      const cart = await getCart();
      if (cart === null || cart.lineItems === null) {
        throw new Error('Cart items expected');
      }
      const result = await deleteProductFromCart(cart.id, cart.version, getAllItemsRemoveActions(cart.lineItems));
      if (result === null) {
        throw new Error('Clear cart expected');
      }
      cartContainer.innerHTML = '';
      updateHeaderItemsAmount(result);
      this.createNoProductsContainer(cartContainer);
    });

    cartContainer.innerHTML = '';
    cart.lineItems.forEach((item) => {
      this.createProductCard(item, cartItems);
    });

    const checkout = el('.checkout', [
      el('.checkout-title', 'Order details'),
      totalCartPrice,
      el('.checkout-items-amount', `Products in cart: ${cart.totalLineItemQuantity}`),
      clearCartButton,
      orderCartButton,
    ]);
    mount(cartContainer, cartItems);
    mount(checkout, this.createPromocodeBlock(totalCartPrice, cart));
    mount(cartContainer, checkout);
  }

  private createTotalCartPriceBlock(cart: Cart): HTMLElement {
    const totalPriceValue = getPriceInUsd(cart.totalPrice.centAmount);
    const totalPriceWithoutDiscounts = getPriceInUsd(
      cart.lineItems.reduce((acc, item) => acc + item.price.value.centAmount * item.quantity, 0)
    );

    return cart.discountCodes.length
      ? el('.checkout-total-price', 'Total price: ', [
          el('span.old-price', totalPriceWithoutDiscounts),
          el('span', totalPriceValue),
        ])
      : el('.checkout-total-price', `Total price: ${totalPriceValue}`);
  }

  private createPromocodeBlock(totalCartPrice: HTMLElement, cart: Cart): HTMLElement {
    const promoInput = el('input.promo-input', { placeholder: 'promo code' });
    if (!(promoInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    const promoInfo = el('.promo-info');
    if (cart.discountCodes.length) {
      getPromocodeById(cart.discountCodes[0].discountCode.id).then((appliedPromocode) => {
        promoInfo.classList.add('applied');
        promoInfo.innerHTML = `Code ${appliedPromocode?.code} applied`;
      });
    }
    const promoButton = el('button.promo-button', 'apply code');
    promoButton.addEventListener('click', async () => {
      const promocodes = await getPromocodes();
      const promocodeFromUser = promoInput.value.trim();
      const promocodeInSystem = promocodes?.results.find((promocode) => promocode.code === promocodeFromUser);
      if (!promocodeInSystem) {
        promoInfo.classList.add('invalid');
        promoInfo.innerHTML = 'Invalid promo code';
        return;
      }
      promoInfo.classList.replace('invalid', 'applied');
      promoInfo.innerHTML = `Code ${promocodeFromUser} applied`;
      const cart = await getCart();
      if (cart === null) {
        return;
      }
      const cartWithPromocode = await addPromocodeToCart(cart, promocodeInSystem.code);
      if (cartWithPromocode === null) {
        throw new Error('Updated cart expected');
      }
      cartWithPromocode.lineItems.forEach((item) => {
        const itemTotalCostBlock = safeQuerySelector(`[data-key="${item.productKey}"] .item-total`);
        itemTotalCostBlock.innerHTML = `total: ${getPriceInUsd(item.totalPrice.centAmount)}`;
      });
      setChildren(totalCartPrice, [this.createTotalCartPriceBlock(cartWithPromocode)]);
    });
    return el('.promo-block', [promoInput, promoInfo, promoButton]);
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
    const removeIcon = el('button.remove-item-button', [el('img.remove-item', { src: minus, alt: 'remove' })]);
    if (!(removeIcon instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    const addIcon = el('button.add-item-button', [el('img.add-item', { src: addIconSrc, alt: 'add' })]);
    if (!(addIcon instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    this.listenClickOnItemsAmountUpdateButtons(addIcon, removeIcon, item, itemsAmountBlock, itemTotalCostBlock);
    const deleteItem = el('button.delete-item', [el('img.delete-item-icon', { src: trashCan, alt: 'delete' })]);
    if (!(deleteItem instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    const itemContainer = el('.item', { 'data-key': item.productKey }, [
      el('.item-image-wrapper', [el('img.item-image', { src: images[0].url, alt: '' })]),
      el('.item-content', [
        el('.item-name', `${item.name['en-US']}`),
        el('.item-price', ` price: ${getPriceInUsd(item.price.value.centAmount)}`),
        el('.items-amount-wrapper', [el('.edit-item-quantity', [removeIcon, itemsAmountBlock, addIcon])]),
      ]),
      itemTotalCostBlock,
      deleteItem,
    ]);
    this.listenClickOnDeleteItem(deleteItem, item, itemsAmountBlock, productWrapper, itemContainer);
    mount(productWrapper, itemContainer);
  }

  private listenClickOnDeleteItem(
    deleteItem: HTMLButtonElement,
    item: LineItem,
    itemsAmountBlock: HTMLElement,
    productWrapper: HTMLElement,
    itemContainer: HTMLElement
  ): void {
    deleteItem.addEventListener('click', async () => {
      const cart = await getCart();
      if (cart === null) {
        throw new Error('Cart expected');
      }
      const updatedCart = await deleteProductFromCart(cart.id, cart.version, [
        getRemoveItemAction(item.id, Number(itemsAmountBlock.innerHTML)),
      ]);
      if (updatedCart === null) {
        throw new Error('Cart update expected');
      }
      updateHeaderItemsAmount(updatedCart);
      if (!updatedCart.totalLineItemQuantity) {
        const cartContainer = safeQuerySelector('.cart-container', document);
        cartContainer.innerHTML = '';
        this.createNoProductsContainer(cartContainer);
      }
      unmount(productWrapper, itemContainer);
      if (updatedCart.totalLineItemQuantity) {
        this.updateOrderDetails(updatedCart);
      }
    });
  }

  private listenClickOnItemsAmountUpdateButtons(
    addItemButton: HTMLButtonElement,
    removeItemButton: HTMLButtonElement,
    item: LineItem,
    itemsAmountBlock: HTMLElement,
    itemTotalCostBlock: HTMLElement
  ): void {
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
  }

  private addToCart(
    itemId: string,
    itemsAmountBlock: HTMLElement,
    itemTotalCostBlock: HTMLElement,
    addIcon: HTMLButtonElement,
    removeIcon: HTMLButtonElement
  ): void {
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
          if (!updatedCart.totalLineItemQuantity) {
            throw new Error('Items in cart expected');
          }
          this.updateOrderDetails(updatedCart);
          itemTotalCostBlock.innerHTML = `total: ${getPriceInUsd(item.totalPrice.centAmount)}`;
          updateHeaderItemsAmount(updatedCart);
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

  private updateOrderDetails(cart: Cart): void {
    setChildren(safeQuerySelector('.checkout-total-price', document), [this.createTotalCartPriceBlock(cart)]);
    safeQuerySelector('.checkout-items-amount', document).innerHTML = `Products in cart: ${cart.totalLineItemQuantity}`;
  }

  protected build(): HTMLElement {
    return this.createCart(this.createCartContainer());
  }

  static getItemsQuantity(itemsAmountBlock: HTMLElement): number {
    const itemsAmount = Number(itemsAmountBlock.innerHTML);
    if (itemsAmount >= 1) {
      return itemsAmount;
    }
    throw new Error('Positive items amount expected');
  }

}

export { CartPage };
