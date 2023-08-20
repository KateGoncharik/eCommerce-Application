import { Schemas, dataValue } from '@schemas/schemas-registration-form';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { createUser } from '@sdk/requests';
import { DataUser } from '@sdk/type';

export class ValidationForm {
  private checkValidation(userData: Schemas, element: Element, showElement: Element): void {
    const validationResult = Schemas.safeParse(userData);
    const showBlock = showElement as HTMLElement;

    if (!validationResult.success && !element.classList.contains('disabled-input')) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;

      for (const key in fieldErrors) {
        const arrayErrors = fieldErrors[key as keyof typeof fieldErrors];

        if (arrayErrors !== undefined) {
          showBlock.style.display = 'flex';
          showBlock.textContent = this.showErrors(arrayErrors);

          element.classList.remove('input-valid');
          element.classList.add('input-error');
        }
      }
    } else {
      showBlock.textContent = '';
      showBlock.style.display = 'none';

      element.classList.add('input-valid');
      element.classList.remove('input-error');
    }
  }

  public eventInput(blockForms: HTMLElement | Element): void {
    Array.from(blockForms.children).forEach((inputs) => {
      if (!(inputs instanceof HTMLInputElement) || inputs.classList.contains('checkbox-reg')) {
        this.eventInput(inputs);
      } else {
        inputs.addEventListener('input', () => {
          this.checkChangeInput(inputs);
        });
        return;
      }
    });
  }

  public eventCheckBox(element: HTMLElement, billing: HTMLElement, shipping: HTMLElement): void {
    const inputsBilling = document.getElementsByClassName('input-billing');
    const inputsShipping = document.getElementsByClassName('input-shipping');

    element.addEventListener('click', (event) => {
      if (!(shipping instanceof HTMLInputElement) || !(billing instanceof HTMLInputElement)) {
        return;
      }
      const target = event.target as HTMLInputElement;

      if (target.id === 'use-billing-for-shipping') {
        target.checked ? (shipping.disabled = true) : (shipping.disabled = false);
        this.disabledInputAddress(inputsShipping, target.checked);
      }

      if (target.id === 'use-shipping-for-billing') {
        target.checked ? (billing.disabled = true) : (billing.disabled = false);
        this.disabledInputAddress(inputsBilling, target.checked);
      }
    });
  }

  private disabledInputAddress(blockInput: HTMLCollectionOf<Element>, status: boolean): void {
    Array.from(blockInput).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      status ? (input.disabled = true) : (input.disabled = false);
      input.classList.toggle('disabled-input');
    });
  }

  public checkChangeInput(input: HTMLInputElement): void {
    const placeholder = input.placeholder;
    const showErrorBlock = input.nextElementSibling!;

    const data: dataValue = {
      [placeholder]: input.value,
    };

    this.checkValidation(data, input, showErrorBlock);
  }

  public checkValidationAllForm(elementBtn: HTMLElement): void {
    const inputs = document.getElementsByClassName('input');
    let countTrue = 0;
    const checkInputsValid = (): void => {
      countTrue = 0;

      Array.from(inputs).forEach((input) => {
        if (!(input instanceof HTMLInputElement)) {
          return;
        }
        this.checkChangeInput(input);
        if (input.classList.contains('input-valid')) {
          return countTrue++;
        }

        this.checkChangeInput(input);
      });

      this.dispatchForm(countTrue === inputs.length);
    };

    elementBtn.addEventListener('click', checkInputsValid);
  }

  private showErrors(arr: string[]): string {
    const createError = arr[0];
    return createError;
  }

  private getAssembleArray(): object | undefined {
    const checkboxDefaultBilling = safeQuerySelector('#billing-default-checkbox');
    const checkboxDefaultShipping = safeQuerySelector('#shipping-default-checkbox');
    const checkboxBillingUseAll = safeQuerySelector('#use-billing-for-shipping');
    const checkboxShippingUseAll = safeQuerySelector('#use-shipping-for-billing');
    const inputs = document.getElementsByClassName('input');
    const userData: { [key: string]: Record<string, string | number | Record<string, string>[]> } = {
      body: {},
    };
    const objBilling: Record<string, string> = {};
    const objShipping: Record<string, string> = {};

    if (
      !(checkboxDefaultBilling instanceof HTMLInputElement) ||
      !(checkboxDefaultShipping instanceof HTMLInputElement) ||
      !(checkboxBillingUseAll instanceof HTMLInputElement) ||
      !(checkboxShippingUseAll instanceof HTMLInputElement)
    ) {
      return;
    }

    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement) || input.classList.contains('checkbox-reg')) {
        return;
      }

      const dataAttribute = input.getAttribute('data')!;

      if (input.classList.contains('input-billing')) {
        if (checkboxBillingUseAll.checked) {
          objBilling[dataAttribute] = input.value;
          objShipping[dataAttribute] = input.value;
        } else {
          objBilling[dataAttribute] = input.value;
        }
      } else if (input.classList.contains('input-shipping')) {
        if (checkboxShippingUseAll.checked) {
          objBilling[dataAttribute] = input.value;
          objShipping[dataAttribute] = input.value;
        } else {
          objShipping[dataAttribute] = input.value;
        }
      } else {
        userData.body[dataAttribute] = input.value;
      }
    });

    userData.body['addresses'] = [objBilling, objShipping];

    checkboxDefaultBilling.checked
      ? (userData.body['defaultBillingAddress'] = 1)
      : (userData.body['defaultBillingAddress'] = 0);
    checkboxDefaultShipping.checked
      ? (userData.body['defaultShippingAddress'] = 1)
      : (userData.body['defaultShippingAddress'] = 0);

    return userData;
  }

  public showSuccessfulRegistrartion(): void {
    const successfulBlock = safeQuerySelector('.successful');
    const formBlock = safeQuerySelector('.registration-form');

    formBlock.style.display = 'none';
    successfulBlock.style.display = 'flex';
  }

  public dispatchForm(statusForm: boolean): void {
    if (statusForm === true) {
      const getArray = this.getAssembleArray() as DataUser;
      createUser(getArray!).then((statusCode) => {
        if (statusCode === 201) {
          this.showSuccessfulRegistrartion();
        }
      });
    }
  }
}
