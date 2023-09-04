import { safeQuerySelector } from './safe-query-selector';

export function toggleInputsState(): void {
  const inputs = document.getElementsByClassName('input');
  const shippingDefaultCheckbox = safeQuerySelector('#shipping-default-checkbox', document);
  const billingDefaultCheckbox = safeQuerySelector('#billing-default-checkbox', document);
  const useShippingForBillingCheckbox = safeQuerySelector('#use-shipping-for-billing', document);
  const checkboxes = [shippingDefaultCheckbox, billingDefaultCheckbox, useShippingForBillingCheckbox];
  checkboxes.forEach((checkbox) => {
    if (!(checkbox instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    checkbox.disabled = checkbox.disabled ? false : true;
  });
  Array.from(inputs).forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }

    input.disabled = input.disabled ? false : true;
  });
}
