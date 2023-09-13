export function toggleIconsState(icons: HTMLButtonElement[]): void {
  icons.forEach((icon: HTMLButtonElement) => {
    icon.disabled = icon.disabled ? false : true;
  });
}
