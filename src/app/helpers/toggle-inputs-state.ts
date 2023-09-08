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
