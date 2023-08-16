import { Shemas, dataValue } from '../schemas/schemas-registration-form';

export class ValidationForm {

  public checkValidation(userData: Shemas, element: Element, showElement: Element): void {
    const validationResult = Shemas.safeParse(userData);
    const showBlock = showElement as HTMLElement

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;

      for (const key in fieldErrors) {
        const arrayErrors = fieldErrors[key as keyof typeof fieldErrors];

        if(arrayErrors !== undefined){
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

  public eventInput(blockRegistration: HTMLElement): void {
 
    Array.from(blockRegistration.children).forEach((blockInputs) => {
      Array.from(blockInputs.children).forEach((input) => {

        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        input.addEventListener('input', () => {
          this.checkChangeInput(input)
        })
      });
    });
  }

  private checkChangeInput(input: HTMLInputElement): void {
    const placeholder = input.placeholder;
    const showErrorBlock = document.getElementsByClassName(`show-validation-${input.classList[0]}`)[0]!;

    const data: dataValue = {
      [placeholder]: input.value
    };

    this.checkValidation(data, input, showErrorBlock);
  }

  public checkValidationAllForm(elementBtn: HTMLElement): void {
    const inputs = document.getElementsByClassName('input');
    let countTrue:number;

    const checkInputsValid = ():void => {
      countTrue = 0;

      Array.from(inputs).forEach((input) => {
        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        if(input.classList.contains('input-valid')) {
          countTrue++
        }

        this.checkChangeInput(input)
      })

      console.log(countTrue)
    }

    elementBtn.addEventListener('click', checkInputsValid)
  }

  public showErrors(arr: string[]): string {
    const createError = arr[0];
    return createError;
  }

}
