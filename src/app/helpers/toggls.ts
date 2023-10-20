import { safeQuerySelector } from '@helpers/safe-query-selector';

export function toggleIconsState(icons: HTMLButtonElement[]): void {
  icons.forEach((icon: HTMLButtonElement) => {
    icon.disabled = icon.disabled ? false : true;
  });
}

export function togglePasswordVisibility(passwordInput: HTMLInputElement): void {
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'passoword';
}

export function markInputAsValid(element: HTMLInputElement): void {
  element.classList.remove('invalid');
  element.classList.add('valid');
}

export function markInputAsInvalid(element: HTMLInputElement): void {
  element.classList.remove('valid');
  element.classList.add('invalid');
}

export function toggleSaveButtonState(): void {
  const saveButton = safeQuerySelector('.save-button');
  if (!(saveButton instanceof HTMLButtonElement)) {
    throw new Error('Input expected');
  }
  saveButton.disabled = saveButton.disabled ? false : true;
}

export function toggleInputsState(): void {
  const inputs = document.getElementsByClassName('input');

  Array.from(inputs).forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Input expected');
    }
    if (
      input.classList.contains('street-input') ||
      input.classList.contains('city-input') ||
      input.classList.contains('country-code-input-shipping') ||
      input.classList.contains('postal-code-input-shipping')
    ) {
      return;
    }

    input.disabled = input.disabled ? false : true;
  });
}
