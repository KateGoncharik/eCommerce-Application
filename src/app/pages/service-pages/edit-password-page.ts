import { Page } from '@templates/page';
import { el } from 'redom';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { getUserOrError } from '@helpers/get-user-or-error ';
import { togglePasswordVisibility } from '@helpers/toggle-password-visibility';
import { editUserPassword } from '@sdk/requests';
import { ValidationForm } from '@validation/validation-registration-form';

class EditPasswordPage extends Page {
  protected textObject = {
    title: 'User page',
  };

  private validation = new ValidationForm();

  private createPasswordUpdateBlock(): HTMLElement {
    const currentPasswordVisibility = el('input.password-checkbox', { type: 'checkbox' });
    const newPasswordVisibility = el('input.password-checkbox', { type: 'checkbox' });
    const currentPasswordInput = el('input.current-password-input.input', {
      type: 'password',
      placeholder: 'password',
      data: 'password',
    });
    const newPasswordInput = el('input.new-password-input.input', {
      type: 'password',
      placeholder: 'password',
      data: 'password',
    });
    if (!(currentPasswordInput instanceof HTMLInputElement) || !(newPasswordInput instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    const passwordUpdateBlock = el('.password-update-block', [
      el('.input-block', [
        el('span.user-info-subtitle', 'Confirm current password'),
        currentPasswordInput,
        el('.show-validation-password-input show-validation', ''),
        el('.password-visability-block', 'Show current password', [currentPasswordVisibility]),
      ]),
      el('.input-block', [
        el('span.user-info-subtitle', 'Create new'),
        newPasswordInput,
        el('.show-validation-password-input show-validation', ''),
        el('.password-visability-block', 'Show new password', [newPasswordVisibility]),
      ]),
      this.createSaveButton(),
      this.createCancelButton(),
    ]);
    currentPasswordVisibility.addEventListener('click', () => togglePasswordVisibility(currentPasswordInput));
    newPasswordVisibility.addEventListener('click', () => togglePasswordVisibility(newPasswordInput));
    this.validation.eventInput(passwordUpdateBlock);
    return passwordUpdateBlock;
  }

  private createSaveButton(): HTMLButtonElement {
    const button = el('button.save-button', 'save');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', async () => {
      const currentPasswordInput = safeQuerySelector('.current-password-input', document);
      const newPasswordInput = safeQuerySelector('.new-password-input', document);
      if (!(currentPasswordInput instanceof HTMLInputElement) || !(newPasswordInput instanceof HTMLInputElement)) {
        throw new Error('Input expected');
      }
      this.validation.checkChangeInput(currentPasswordInput);
      this.validation.checkChangeInput(newPasswordInput);
      const isAllInputsValid = [currentPasswordInput, newPasswordInput].every((input) =>
        input.classList.contains('input-valid')
      );

      if (isAllInputsValid) {
        const user = getUserOrError();
        editUserPassword({
          id: user.id,
          version: user.version,
          currentPassword: currentPasswordInput.value,
          newPassword: newPasswordInput.value,
        });
      }
    });
    return button;
  }

  private createCancelButton(): HTMLButtonElement {
    const button = el('button.cancel-button', 'cancel');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Button expected');
    }
    button.addEventListener('click', async () => {
      const currentPasswordInput = safeQuerySelector<HTMLInputElement>('.current-password-input', document);
      const newPasswordInput = safeQuerySelector<HTMLInputElement>('.new-password-input', document);
      currentPasswordInput.value = '';
      newPasswordInput.value = '';
    });
    return button;
  }

  protected build(): HTMLElement {
    return this.createPasswordUpdateBlock();
  }
}
export { EditPasswordPage };
