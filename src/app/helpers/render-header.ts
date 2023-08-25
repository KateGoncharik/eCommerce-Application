import { safeQuerySelector } from '@helpers/safe-query-selector';
import { Header } from '@app/components/header';

export function renderHeader(): void {
  const main = safeQuerySelector('main', document);
  const newHeader = new Header().create();
  const wrapper = main.closest('div');

  if (!wrapper) {
    throw new Error('Div expected');
  }

  document.body.querySelector('header')?.remove();

  wrapper.insertBefore(newHeader, main);
}
