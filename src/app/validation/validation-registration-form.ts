import { Schemas, dataValue } from '@schemas/schemas-registration-form';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { createUser, isUserExist } from '@sdk/requests';
import { DataUser } from '@app/types/datauser';

export class ValidationForm {
  
  private checkValidation(userData: Schemas, input: Element, showElement: Element): void {
    const showBlock = showElement as HTMLElement;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.getAttribute('data') === 'country' && input.classList.remove('active');
    input.getAttribute('data') === 'postalCode' && input.classList.add('active');

    const validationResult = Schemas.safeParse(userData);

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
      input.getAttribute('data') === 'country' && input.classList.add('active');
      
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

      const showErrorBlock = input.nextElementSibling! as HTMLElement;

      !input.disabled ? (input.disabled = true) : (input.disabled = false);
      input.classList.toggle('disabled-input');
      input.classList.remove('input-error');
      input.value = '';
      showErrorBlock.style.display = 'none';
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

      this.checkNewUSer()

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

  private checkNewUSer():void {
    const emailInput = safeQuerySelector<HTMLInputElement>('.email-input ');
    const showErrorBlock = emailInput.nextElementSibling! as HTMLElement;

    isUserExist(emailInput.value).then((result) => {
      if (result) {
        showErrorBlock.style.display = 'flex';
        showErrorBlock.textContent = 'An account with Email already exists.';

        emailInput.classList.remove('input-valid');
        emailInput.classList.add('input-error');
      }
    });
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
  private showErrors(arr: string[]): string {
    const createError = arr[0];
    return createError;
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
