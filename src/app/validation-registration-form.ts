import { Shemas, obj } from '../schemas/schemas-registration-form';

export class ValidationForm {
  private getValidation(userData: Shemas, element: HTMLInputElement): string[] | undefined {
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

        return arrayErros;
      }
    } else {
      console.log('dad' + element);
      if (element.classList.contains('input-error')) {
        element.classList.remove('input-error');
        element.classList.add('input-valid');
      }
    }
  }

  public eventInput(): void {
    const Input = document.getElementsByClassName('input') as HTMLCollectionOf<HTMLInputElement>;

    Array.from(Input).forEach((element) => {
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
