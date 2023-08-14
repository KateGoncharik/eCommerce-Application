import { Shemas, obj } from '../schemas/schemas-registration-form';

export class ValidationForm {
  public getValidation(userData: Shemas, element: Element): string[] | undefined {
    const validationResult = Shemas.safeParse(userData);
    let arrayErros: string[] | undefined;
    // console.log(validationResult)

    if (!validationResult.success) {
      // console.log(validationResult.error.formErrors.fieldErrors)
      for (const key in validationResult.error.formErrors.fieldErrors) {
        const fieldErrors = validationResult.error.formErrors.fieldErrors;
        arrayErros = fieldErrors[key as keyof typeof fieldErrors];
        // console.log( arrayErros)
        // console.log( fieldErrors)
        this.showValidation(element);
        return arrayErros;
      }
    } else {
      this.showValidation(element);
    }
  }

  public eventInput(el: HTMLElement): void {
    // const Input = document.getElementsByClassName('input') as HTMLCollectionOf<HTMLInputElement>;
    console.log(el.children);
    Array.from(el.children).forEach((element) => {
      element.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const placeholder = target.placeholder as string;

        console.log(target.placeholder);
        console.log(target.value);

        const data: obj = {};
        data[placeholder] = target.value;

        this.getValidation(data, element);

        console.log(this.getValidation(data, element));
      });
    });
  }

  private showValidation(element: Element): void {
    element.classList.toggle('input-valid');
    element.classList.toggle('input-error');
  }
}
