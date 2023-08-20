import { el } from 'redom';

class Button {
  constructor(
    private text: string,
    private color: 'white' | 'black'
  ) {
    this.text = text;
    this.color = color;
  }
  public render(): HTMLElement {
    const button = el('button.default-btn', this.text);
    if (this.color === 'black') {
      button.classList.add('default-btn-black');
    }
    return button;
  }
}

export { Button };
