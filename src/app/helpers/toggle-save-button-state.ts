import { safeQuerySelector } from '@helpers/safe-query-selector';

export function toggleSaveButtonState(): void {
  const saveButton = safeQuerySelector('.save-button');
  if (!(saveButton instanceof HTMLButtonElement)) {
    throw new Error('Input expected');
  }
  saveButton.disabled = saveButton.disabled ? false : true;
}
