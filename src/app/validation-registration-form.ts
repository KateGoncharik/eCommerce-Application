import { Shemas, obj } from '../schemas/schemas-registration-form';

export class ValidationForm {
  public getValidation(userData: Shemas, element: Element): void {
    const validationResult = Shemas.safeParse(userData);
    let arrayErros: string[] | undefined;

    if (!validationResult.success) {
      for (const key in validationResult.error.formErrors.fieldErrors) {
        const fieldErrors = validationResult.error.formErrors.fieldErrors;
        arrayErros = fieldErrors[key as keyof typeof fieldErrors];

        console.log(arrayErros);
        console.log(fieldErrors);

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

        const data: obj = {};
        data[placeholder] = target.value;

        this.getValidation(data, element);

        console.log(this.getValidation(data, element));
      });
    });
  }
}
