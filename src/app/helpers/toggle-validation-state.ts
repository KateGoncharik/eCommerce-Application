export function toggleValidationState(element: HTMLElement, validationState: string): void {
  if (validationState === 'valid') {
    element.classList.remove('invalid');
    element.classList.add('valid');
  } else {
    element.classList.remove('valid');
    element.classList.add('invalid');
  }
}
