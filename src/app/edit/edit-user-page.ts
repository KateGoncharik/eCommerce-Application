import { ValidationForm } from '@app/validation/validation-registration-form';

class EditUserPage {
  private validation = new ValidationForm();

  public toggleInputsState(): void {
    const infoInputs = document.getElementsByClassName('input');
    Array.from(infoInputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        throw new Error('Input expected');
      }
      if (input.disabled === true) {
        input.disabled = false;
      } else {
        input.disabled = true;
      }
    });
  }

  public editUserInformation(): void {
    console.log('i am editing your information');
    this.toggleInputsState();
    this.validation.getAssembleArray();
  }
}

export { EditUserPage };
