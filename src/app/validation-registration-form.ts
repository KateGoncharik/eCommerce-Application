import { Shemas, dataValue } from '../schemas/schemas-registration-form';

export class ValidationForm {

  public getValidation(userData: Shemas, element: Element, showElement: Element): void {
    const validationResult = Shemas.safeParse(userData);
    const showBlock = showElement as HTMLElement

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;

      for (const key in fieldErrors) {
        const arrayErrors = fieldErrors[key as keyof typeof fieldErrors];

        if(arrayErrors !== undefined){
          showBlock.style.display = 'flex';
          showBlock.textContent = this.showErrors(arrayErrors);
        }
  
        element.classList.remove('input-valid');
        element.classList.add('input-error');
      }
    } else {
      showBlock.textContent = '';
      showBlock.style.display = 'none';

      element.classList.add('input-valid');
      element.classList.remove('input-error');
    }
  }

  public eventInput(element: HTMLElement): void {
 
    Array.from(element.children).forEach((el) => {
      Array.from(el.children).forEach((input) => {

        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        input.addEventListener('input', () => {
      
          const placeholder = input.placeholder;
          const showBlock = document.getElementsByClassName(`show-validation-${input.classList[0]}`)[0]!;

          const data: dataValue = {
            [placeholder]: input.value
          };
          
          this.getValidation(data, input, showBlock);
        })
      });
    });
  }

  public showErrors(arr: string[]): string {
    const createError = arr[0]
    return createError
  }

  
}
