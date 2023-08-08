import { main } from '../app';

abstract class Page {
  protected abstract textObject: { [key: string]: string };
  private createTitle(): HTMLHeadingElement {
    const title = document.createElement('h1');
    title.textContent = this.textObject.title;
    return title;
  }
  private build(): HTMLElement {
    const container = document.createElement('div');
    const title = this.createTitle();
    container.append(title);
    return container;
  }
  public render(): void {
    main.innerHTML = '';
    const container = this.build();
    main.append(container);
  }
}

export default Page;
