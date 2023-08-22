export function safeQuerySelector<T extends HTMLElement>(
  selector: string,
  parentElement: Document | HTMLElement | DocumentFragment = document
): T {
  const elem = parentElement.querySelector<T>(selector);
  if (!elem) {
    throw new Error(`Element '${selector}' was not found`);
  }
  return elem;
}
