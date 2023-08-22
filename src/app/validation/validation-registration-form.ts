import { Schemas, dataValue } from '@schemas/schemas-registration-form';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { createUser, isUserExist } from '@sdk/requests';
import { DataUser } from '@app/types/datauser';

export class ValidationForm {
  private checkValidation(userData: Schemas, input: Element, showElement: Element): void {
    const validationResult = Schemas.safeParse(userData);
    const showBlock = showElement as HTMLElement;
    const inputCountryShipping = safeQuerySelector('.country-code-input-shipping');
    const inputCountryCodeBilling = safeQuerySelector('.country-code-input-billing');

    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    if (
      input.classList.contains('postal-code-input-billing') ||
      input.classList.contains('postal-code-input-shipping')
    ) {
      input.classList.add('active');
    }

    if (!validationResult.success && !input.classList.contains('disabled-input')) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;

      for (const key in fieldErrors) {
        const arrayErrors = fieldErrors[key as keyof typeof fieldErrors];

        if (arrayErrors !== undefined) {
          showBlock.style.display = 'flex';
          showBlock.textContent = this.showErrors(arrayErrors);

          input.classList.remove('input-valid');
          input.classList.add('input-error');
        }
      }
    } else {
      //registered Email check
      if (input.classList.contains('email-input')) {
        isUserExist(input.value).then((result) => {
          if (result) {
            showBlock.style.display = 'flex';
            showBlock.textContent = 'An account with Email already exists.';

            input.classList.remove('input-valid');
            input.classList.add('input-error');
          }
        });
      }

      if (input.classList.contains('country-code-input-billing')) {
        inputCountryCodeBilling.classList.add('active');
        inputCountryShipping.classList.remove('active');
      }
      if (input.classList.contains('country-code-input-shipping')) {
        inputCountryShipping.classList.add('active');
        inputCountryCodeBilling.classList.remove('active');
      }

      showBlock.textContent = '';
      showBlock.style.display = 'none';

      input.classList.add('input-valid');
      input.classList.remove('input-error');
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

  public eventCheckBox(element: HTMLElement, shipping: HTMLElement): void {
    const inputsBilling = document.getElementsByClassName('input-billing');
  
    element.addEventListener('click', (event) => {
      if (!(shipping instanceof HTMLInputElement)) {
        return;
      }
      const target = event.target as HTMLInputElement;
      if (target.id === 'use-shipping-for-billing') {
        this.disabledInputAddress(inputsBilling);
      }
    });
  }

  private disabledInputAddress(blockInput: HTMLCollectionOf<Element>): void {
    Array.from(blockInput).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      !input.disabled ? (input.disabled = true) : (input.disabled = false);
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

      countTrue === inputs.length && this.dispatchForm();
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
    const checkboxShippingUseAll = safeQuerySelector('#use-shipping-for-billing');
    const inputs = document.getElementsByClassName('input');
    let value: string | undefined;
    const userData: { [key: string]: Record<string, string | number | Record<string, string>[]> } = {
      body: {},
    };
    const objBilling: Record<string, string> = {};
    const objShipping: Record<string, string> = {};

    if (
      !(checkboxDefaultBilling instanceof HTMLInputElement) ||
      !(checkboxDefaultShipping instanceof HTMLInputElement) ||
      !(checkboxShippingUseAll instanceof HTMLInputElement)
    ) {
      return;
    }

    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement) || input.classList.contains('checkbox-reg')) {
        return;
      }

      const dataAttribute = input.getAttribute('data')!;

      input.getAttribute('data')! === 'country' ? (value = this.getCodeCountry(input)) : (value = input.value);

      if (input.classList.contains('input-billing')) {
         if (!checkboxShippingUseAll.checked) {
          objBilling[dataAttribute] = value;
        }
      } else if (input.classList.contains('input-shipping')) {
        if (checkboxShippingUseAll.checked) {
          objBilling[dataAttribute] = value;
          objShipping[dataAttribute] = value;
        } else {
          objShipping[dataAttribute] = value;
        }
      } else {
        userData.body[dataAttribute] = value;
      }
    });

    userData.body['addresses'] = [objShipping, objBilling];

    checkboxDefaultBilling.checked && (userData.body['defaultBillingAddress'] = 1);
    checkboxDefaultShipping.checked && (userData.body['defaultShippingAddress'] = 0);

    return userData;
  }

  public getCodeCountry(input: HTMLInputElement): string {
    let codeCountry: string | undefined;
    switch (input.value) {
      case 'United States':
        codeCountry = 'US';
        break;
      case 'Germany':
        codeCountry = 'DE';
        break;
      case 'Spain':
        codeCountry = 'ES';
        break;
      case 'Australia':
        codeCountry = 'AU';
        break;
    }
    return codeCountry!;
  }

  public showSuccessfulRegistrartion(): void {
    const successfulBlock = safeQuerySelector('.successful');
    const formBlock = safeQuerySelector('.registration-form');

    formBlock.style.display = 'none';
    successfulBlock.style.display = 'flex';
  }

  public dispatchForm(): void {
    const getArray = this.getAssembleArray() as DataUser;

    createUser(getArray!).then((statusCode) => {
      if (statusCode === 201) {
        this.showSuccessfulRegistrartion();
      }
    });
  }
}
