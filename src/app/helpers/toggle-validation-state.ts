function markInputAsValid(element: HTMLElement): void {
  element.classList.remove('invalid');
  element.classList.add('valid');
}

function markInputAsInvalid(element: HTMLElement): void {
  element.classList.remove('valid');
  element.classList.add('invalid');
}
export { markInputAsValid, markInputAsInvalid };
