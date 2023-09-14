import { ProductMainData } from '@customTypes/catalog';
import { el, mount, setChildren } from 'redom';
import addIcon from '@icons/add.png';
import lottie from 'lottie-web';
import loadIndicator from '@animation/load-indicator.json';
import { addLineItemToCart, getCart, createCart } from '@sdk/requests';
import { ProductProjection } from '@commercetools/platform-sdk';

class ProductCard {
  private productData: ProductMainData;

  constructor(private product: ProductProjection) {
    this.productData = this.extractProductData(this.product);
  }

  public create(): HTMLElement {
    const { key, name, shortDescription, longDescription, image, priceFull, priceDiscounted } = this.productData;
    const card = el('a.product-card', { href: `${window.location}/product/${key}`, 'data-navigo': '' });
    const addToCartBtn = el('img.card-add-btn', { src: addIcon, alt: '', title: 'Add to cart' });
    const priceWrapper = el('.catalog-price-wrap');
    let price: HTMLElement;

    addToCartBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isProductInCart = card.classList.contains('in-cart');
      if (isProductInCart) {
        return;
      }
      setChildren(priceWrapper, [price, this.createLoadAnimItem()]);
      await this.addToCart();
      setChildren(priceWrapper, [price, addToCartBtn]);
      card.classList.add('in-cart');
    });

    if (priceDiscounted) {
      price = el('div', [el('span.card-old-price', priceFull), el('span.card-new-price', priceDiscounted)]);
    } else {
      price = el('.card-new-price', priceFull);
    }
    setChildren(priceWrapper, [price, addToCartBtn]);
    mount(
      card,
      el('.card-content', [
        el('.card-image-wrapper', [
          el('img.card-image', { src: image, alt: '' }),
          el('.card-description', [el('p.card-short-desc', shortDescription), el('p.card-long-desc', longDescription)]),
        ]),
        el('p.card-name', name),
        priceWrapper,
      ])
    );
    return card;
  }

  private async addToCart(): Promise<void> {
    let cart = await getCart();
    if (!cart) {
      cart = await createCart();
    }
    if (cart) {
      await addLineItemToCart(cart, this.product);
    }
  }

  protected createLoadAnimItem(): HTMLElement {
    const animItem = el('div.catalog-load-anim');
    lottie.loadAnimation({
      container: animItem,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loadIndicator,
    });
    return animItem;
  }

  private extractProductData(product: ProductProjection): ProductMainData {
    const price = product.masterVariant.prices?.[0];
    const priceDiscounted = price?.discounted;
    const description = product.description?.['en-US'] || '';
    const getPriceInUsd = (price: number | undefined): string => `$${(Number(price) / 100).toFixed(2)}`;

    return {
      id: product.id,
      key: product.key || '',
      name: product.name['en-US'],
      shortDescription: description.slice(0, 125) + '...',
      longDescription: description.slice(0, 300) + '...',
      image: product.masterVariant.images?.[0].url || '',
      priceFull: getPriceInUsd(price?.value.centAmount),
      priceDiscounted: priceDiscounted ? getPriceInUsd(priceDiscounted.value.centAmount) : '',
    };
  }
}

export { ProductCard };
