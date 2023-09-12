import { ProductMainData } from '@customTypes/catalog';
import { el } from 'redom';
import addIcon from '@icons/add.png';

class ProductCard {
  constructor(private productData: ProductMainData) {
    this.productData = productData;
  }

  public create(): HTMLElement {
    const { key, name, shortDescription, longDescription, image, priceFull, priceDiscounted } = this.productData;
    const addToCartBtn = el('img.card-cart', { src: addIcon, alt: '', title: 'Add to cart' });
    let price: HTMLElement;

    if (priceDiscounted) {
      price = el('div', [el('span.card-old-price', priceFull), el('span.card-new-price', priceDiscounted)]);
    } else {
      price = el('.card-new-price', priceFull);
    }

    return el(
      'a.product-card',
      { href: `${window.location}/product/${key}`, 'data-navigo': '' },
      el('.card-content', [
        el('.card-image-wrapper', [
          el('img.card-image', { src: image, alt: '' }),
          el('.card-description', [el('p.card-short-desc', shortDescription), el('p.card-long-desc', longDescription)]),
        ]),
        el('p.card-name', name),
        el('.catalog-price-wrap', [price, addToCartBtn]),
      ])
    );
  }
}

export { ProductCard };
