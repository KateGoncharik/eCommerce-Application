export function markInputAsValid(element: HTMLInputElement): void {
  element.classList.remove('invalid');
  element.classList.add('valid');
}

export function markInputAsInvalid(element: HTMLInputElement): void {
  element.classList.remove('valid');
  element.classList.add('invalid');
}
