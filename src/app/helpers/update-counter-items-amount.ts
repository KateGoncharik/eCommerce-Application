import { Cart } from '@commercetools/platform-sdk';
import { safeQuerySelector } from './safe-query-selector';

export function updateHeaderItemsAmount(updatedCart: Cart): void {
  const itemsAmountBlock = safeQuerySelector('.header-items-amount', document);
  const itemsAmountBlockCopy = safeQuerySelector('.header-items-amount-mobile', document);
  itemsAmountBlock.innerHTML = `${updatedCart.totalLineItemQuantity ? updatedCart.totalLineItemQuantity : 0}`;
  itemsAmountBlockCopy.innerHTML = itemsAmountBlock.innerHTML;
}
