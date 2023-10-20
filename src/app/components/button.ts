class Button {
  constructor(
    private text: string,
    private color: 'white' | 'black'
  ) {
    this.text = text;
    this.color = color;
  }
  public render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('default-btn');
    button.textContent = this.text;

    if (this.color === 'black') {
      button.classList.add('default-btn-black');
    }
    return button;
  }
}

export { Button };
