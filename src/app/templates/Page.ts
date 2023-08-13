import { main } from '../app';

abstract class Page {
  public render(): void {
    main.innerHTML = '';
    const container = this.build();
    main.append(container);
  }

  protected abstract textObject: Record<string, string>;

  protected createTitle(): HTMLHeadingElement {
    const title = document.createElement('h1');
    title.textContent = this.textObject.title;
    return title;
  }

  protected build(): HTMLElement {
    const container = document.createElement('div');
    const title = this.createTitle();
    container.append(title);
    return container;
  }
}

export { Page };
