import { Page } from '@templates/page';
import { getProduct } from '@sdk/requests';
import { el, mount } from 'redom';

export class ProductPage extends Page {
  protected textObject = {
    title: 'Product page',
  };

  private createProductPage(): HTMLElement {
    const blockProductPage = el('.block-product-page', [
      getProduct('tiger-head-balloon')
        .then((userData) => {
          const productPage = el('.product-page', [
            el('.block-product-img', [el('img.product-img', { src: userData!.img })]),
            el('.block-product-info', [
              el('h3.product-name', userData!.name),
              el('p.product-description', userData!.description),
            ]),
          ]);

          mount(blockProductPage, productPage);
        })
        .catch((err) => console.log(err)),
    ]);

    return blockProductPage;
  }

  protected build(): HTMLElement {
    return this.createProductPage();
  }
}
