export function togglePasswordVisibility(passwordInput: HTMLInputElement): void {
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'passoword';
}
