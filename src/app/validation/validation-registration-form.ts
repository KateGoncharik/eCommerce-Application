import { Schemas, dataValue } from '@schemas/schemas-registration-form';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { createUser } from '@sdk/test-sdk';

// type Data = {
//   body?: {
//     email?: string,
//     password?: string,
//     firstName?: string,
//     lastName?: string,
//     dateOfBirth?: string,
//     addresses?: [
//       {
//         country?: string,
//         city?: string,
//         streetName?: string,
//         postalCode: string
//       },
//       {
//         country?: string,
//         city?: string,
//         streetName?: string,
//         postalCode?: string
//       },
//     ],
//     defaultBillingAddress?: number,
//     defaultShippingAddress?: number,
//   }

// }

type Data = {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: [
      {
        country: string;
        city: string;
        streetName: string;
        postalCode: string;
      },
      {
        country: string;
        city: string;
        streetName: string;
        postalCode: string;
      },
    ];
    defaultBillingAddress: number;
    defaultShippingAddress: number;
  };
};

export class ValidationForm {
  private checkValidation(userData: Schemas, element: Element, showElement: Element): void {
    const validationResult = Schemas.safeParse(userData);
    const showBlock = showElement as HTMLElement;

    if (!validationResult.success) {
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
    const checkboxBilling = safeQuerySelector('#billing-checkbox');
    const checkboxShipping = safeQuerySelector('#shipping-checkbox');
    const inputs = document.getElementsByClassName('input');
    const testData: { [key: string]: Record<string, string | number | Record<string, string>[]> } | Data = {
      body: {},
    };
    const objBilling: Record<string, string> = {};
    const objShipping: Record<string, string> = {};

    if (!(checkboxBilling instanceof HTMLInputElement) || !(checkboxShipping instanceof HTMLInputElement)) {
      return;
    }
    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement) || input.classList.contains('checkbox-reg')) {
        return;
      }
      if (input.classList.contains('email-input')) {
        console.log();
      }

      const dataAttribute = input.getAttribute('data')!;

      if (input.classList.contains('input-billing')) {
        console.log('.input-billing');
        objBilling[dataAttribute] = input.value;
      } else if (input.classList.contains('input-shipping')) {
        console.log('.input-shipping');
        objShipping[dataAttribute] = input.value;
      } else {
        testData.body[dataAttribute] = input.value;
      }
    });

    if (checkboxBilling.checked) {
      testData.body['defaultBillingAddress'] = 1;
      testData.body['defaultShippingAddress'] = 0;
    } else if (checkboxShipping.checked) {
      testData.body['defaultBillingAddress'] = 0;
      testData.body['defaultShippingAddress'] = 1;
    } else {
      testData.body['defaultBillingAddress'] = 1;
      testData.body['defaultShippingAddress'] = 0;
    }

    testData.body['addresses'] = [objBilling, objShipping];
    console.log(testData);

    return testData;
  }

  public dispatchForm(statusForm: boolean): void {
    if (statusForm === true) {
      const result = this.getAssembleArray() as Data;
      createUser(result!);
    }
  }
}
