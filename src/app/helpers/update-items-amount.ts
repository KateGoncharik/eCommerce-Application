import { Cart } from '@commercetools/platform-sdk';
import { safeQuerySelector } from './safe-query-selector';

export function updateItemsAmount(updatedCart: Cart): void {
  const itemsAmountBlock = safeQuerySelector('.header-items-amount', document);
  const itemsAmountBlockCopy = safeQuerySelector('.header-items-amount-copy', document);
  itemsAmountBlock.innerHTML = `${updatedCart.lineItems.length}`;
  itemsAmountBlockCopy.innerHTML = `${updatedCart.lineItems.length}`;
}
