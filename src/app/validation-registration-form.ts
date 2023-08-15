import { Shemas, dataValue } from '../schemas/schemas-registration-form';

export class ValidationForm {

  public getValidation(userData: Shemas, element: Element, showElement: Element): void {
    const validationResult = Shemas.safeParse(userData);
    const showBlock = showElement as HTMLElement

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;

      for (const key in fieldErrors) {
        const arrayErros = fieldErrors[key as keyof typeof fieldErrors];

        if(arrayErros !== undefined){
          showBlock.style.display = 'flex';
          showBlock.textContent = this.showErrors(arrayErros);
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
        
        input.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement;
          const placeholder = target.placeholder;
          const showBlock = document.getElementsByClassName(`show-validation-${target.classList[0]}`)[0]!;

          const data: dataValue = {
            [placeholder]: target.value
          };
          
          this.getValidation(data, input, showBlock);
        })
      });
    });
  }

  public showErrors(arr: string[]): string {
    const createError = arr[0]
    
    console.log(arr)
    return createError
  }

  
}
