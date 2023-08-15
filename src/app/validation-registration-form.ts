import { Shemas, dataObj } from '../schemas/schemas-registration-form';

export class ValidationForm {

  public getValidation(userData: Shemas, element: Element, showBlock: HTMLElement): void {
    const validationResult = Shemas.safeParse(userData);
    console.log(userData)
    

    if (!validationResult.success) {
      for (const key in validationResult.error.formErrors.fieldErrors) {
        const fieldErrors = validationResult.error.formErrors.fieldErrors;
        const arrayErros = fieldErrors[key as keyof typeof fieldErrors];

        // console.log(arrayErros);
        // console.log(fieldErrors);
        if(arrayErros !== undefined){
          showBlock.style.display = 'flex'
          showBlock.textContent = this.showErrors(arrayErros)
          
        }
  
        element.classList.remove('input-valid');
        element.classList.add('input-error');
      }
    } else {
      showBlock.textContent = ''
      showBlock.style.display = 'none'

      element.classList.add('input-valid');
      element.classList.remove('input-error');
    }
  }

  public eventInput(element: HTMLElement): void {
 
    Array.from(element.children).forEach((el) => {
      Array.from(el.children).forEach((input) => {
        
        input.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement;
          const placeholder = target.placeholder as string;
          const showBlock = document.querySelector(`.show-validation-${target.classList[0]}`) as HTMLElement
          console.log(target.placeholder);
          console.log(target.value);

          const data: dataObj = {
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
