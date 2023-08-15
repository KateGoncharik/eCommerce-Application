import { Shemas, dataObj } from '../schemas/schemas-registration-form';

export class ValidationForm {
  public getValidation(userData: Shemas, element: Element): void {
    const validationResult = Shemas.safeParse(userData);
    console.log(userData)

    if (!validationResult.success) {
      for (const key in validationResult.error.formErrors.fieldErrors) {
        const fieldErrors = validationResult.error.formErrors.fieldErrors;
        const arrayErros = fieldErrors[key as keyof typeof fieldErrors];

        // console.log(arrayErros);
        // console.log(fieldErrors);
        if(arrayErros !== undefined){
          this.showErrors(arrayErros)
        }
        element.classList.remove('input-valid');
        element.classList.add('input-error');
      }
    } else {
      element.classList.add('input-valid');
      element.classList.remove('input-error');
    }
  }

  public eventInput(el: HTMLElement): void {
    Array.from(el.children).forEach((element) => {
      console.log(element);
      element.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const placeholder = target.placeholder as string;

        console.log(target.placeholder);
        console.log(target.value);

        const data: dataObj = {
          [placeholder]: target.value
        };
        
        this.getValidation(data, element);

      });
    });
  }

 
}
