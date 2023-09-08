import { Schemas, dataValue, GenderSchema } from '@schemas/schemas-registration-form';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { createUser, isUserExist, authorizeUser } from '@sdk/requests';
import { DataUser } from '@app/types/datauser';
import { Country } from '@app/types/enums';
import { router, redirect } from '@app/router';
import { Route } from '@customTypes/route';
import { renderHeader } from '@helpers/render-header';

export class ValidationForm {
  public validateGenderInput(genderInput: HTMLInputElement): void {
    const showErrorBlock = safeQuerySelector('.show-validation-gender');
    if (!(showErrorBlock instanceof HTMLElement)) {
      return;
    }
    const result = GenderSchema.safeParse(genderInput.value);
    if (result.success) {
      genderInput.classList.remove('input-error');
      genderInput.classList.add('input-valid');
      showErrorBlock.textContent = '';
    } else {
      const errors = result.error.format();
      showErrorBlock.style.display = 'flex';
      showErrorBlock.textContent = `${errors._errors[0]}`;
    }
  }

  private checkValidation(userData: Schemas, input: Element, showElement: Element): void {
    const showBlock = showElement as HTMLElement;
    if (!(input instanceof HTMLInputElement) || input.classList.contains('gender-input')) {
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
    if (input.classList.contains('password-checkbox')) {
      return;
    }
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
    const checkInputsValid = async (): Promise<void> => {
      countTrue = 0;

      this.checkNewUSer();

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

      if (countTrue === inputs.length) {
        const email = safeQuerySelector<HTMLInputElement>('.email-input').value;
        const password = safeQuerySelector<HTMLInputElement>('.password-input').value;
        await this.dispatchForm();
        const authError = await authorizeUser(email, password);
        if (!authError) {
          redirect(Route.Main);
          renderHeader();
          router.updatePageLinks();
        }
      }
    };

    elementBtn.addEventListener('click', checkInputsValid);
  }

  private checkNewUSer(): void {
    const emailInput = safeQuerySelector<HTMLInputElement>('.email-input ');
    const showErrorBlock = emailInput.nextElementSibling! as HTMLElement;

    isUserExist(emailInput.value).then((result) => {
      if (result) {
        showErrorBlock.style.display = 'flex';
        showErrorBlock.textContent = 'An account with this email already exists.';

        emailInput.classList.remove('input-valid');
        emailInput.classList.add('input-error');
      }
    });
  }

  private getAssembleArray(): object | undefined {
    const checkboxDefaultBilling = safeQuerySelector<HTMLInputElement>('#billing-default-checkbox');
    const checkboxDefaultShipping = safeQuerySelector<HTMLInputElement>('#shipping-default-checkbox');
    const checkboxShippingUseAll = safeQuerySelector<HTMLInputElement>('#use-shipping-for-billing');
    const inputs = document.getElementsByClassName('input');
    let value: string | undefined;
    const userData: { [key: string]: Record<string, string | number | Record<string, string>[]> } = {
      body: {},
    };
    const objBilling: Record<string, string> = {};
    const objShipping: Record<string, string> = {};

    Array.from(inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement) || input.classList.contains('checkbox-reg')) {
        return;
      }

      const dataAttribute = input.getAttribute('data')!;

      dataAttribute === 'country' ? (value = this.getCodeCountry(input)) : (value = input.value);

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
      case Country.UnitedStates:
        codeCountry = 'US';
        break;
      case Country.Germany:
        codeCountry = 'DE';
        break;
      case Country.Spain:
        codeCountry = 'ES';
        break;
      case Country.Australia:
        codeCountry = 'AU';
        break;
    }
    return codeCountry!;
  }

  public showSuccessfulRegistration(): void {
    const successfulBlock = safeQuerySelector('.successful');
    const formBlock = safeQuerySelector('.registration-form');

    formBlock.style.display = 'none';
    successfulBlock.style.display = 'flex';
  }
  private showErrors(arr: string[]): string {
    const createError = arr[0];
    return createError;
  }

  public async dispatchForm(): Promise<void> {
    const getArray = this.getAssembleArray() as DataUser;

    const statusCode = await createUser(getArray!);
    if (statusCode === 201) {
      this.showSuccessfulRegistration();
    }
  }
}
