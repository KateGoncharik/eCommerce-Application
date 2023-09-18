import { getRemoveItemAction } from '@helpers/get-actions';
import { Page } from '@templates/page';
import { getProduct, createCart, getCart, addProductToCart, deleteProductFromCart } from '@sdk/requests';
import { el, mount, setAttr } from 'redom';
import { ProductData } from '@app/types/data-product';
import { connectSlider } from '@helpers/slider';
import { eventModal } from '@helpers/modal-img';
import { updateHeaderItemsAmount } from '@helpers/update-counter-items-amount';

export class ProductPage extends Page {
  constructor(private productKey: string) {
    super();
  }

  protected textObject = {
    title: 'Product page',
  };

  private createSlider(productData: ProductData): HTMLElement {
    const slider = el('.swiper');
    const swiperWrapper = el('.swiper-wrapper');
    const btnPrev = el('.swiper-button-prev');
    const btnNext = el('.swiper-button-next');
    const scrollbar = el('.swiper-scrollbar');

    mount(slider, btnPrev);
    mount(slider, btnNext);
    mount(slider, scrollbar);

    for (let i = 0; i < productData!.img.length; i++) {
      const swiperSlide = el('.swiper-slide');
      const img = el('img.product-img', { src: productData!.img[i].url });

      mount(swiperSlide, img);
      mount(swiperWrapper, swiperSlide);
      mount(slider, swiperWrapper);
    }

    return slider;
  }

  private addPrice(productData: ProductData): HTMLElement {
    const blockPrice = el('.block-price');
    const price = el('span', `$${(+productData!.price / 100).toFixed(2)}`);
    const discount = el(
      'span.discount',
      `${productData!.discount ? `$${(+productData!.discount / 100).toFixed(2)}` : ''}`
    );

    productData!.discount ? (price.className = 'price-none') : (price.className = 'price');

    mount(blockPrice, price);
    mount(blockPrice, discount);
    return blockPrice;
  }

  private createProductPage(key: string): HTMLElement {
    const blockCloseModal = el('.block-exit-modal');
    const closeModal = el('.exit-modal');
    const btnAddToCart = el('button.btn-product', { disabled: true });
    const addBlock = el('.block-add', [btnAddToCart]);
    const blockProductPage = el('.block-product-page', [
      el('.blackout'),
      getProduct(key)
        .then((productData) => {
          const productId = productData!.id;
          const slider = this.createSlider(productData!);
          const blockImg = el('.block-product-img', [slider]);
          this.changeBtn(productId, btnAddToCart);

          const productPage = el('.product-page', [
            blockImg,
            el('.block-product-info', [
              el('.product-name', `${productData!.name}`),
              this.addPrice(productData!),
              el('p.product-description', productData!.description),
              addBlock,
            ]),
          ]);

          mount(blockCloseModal, closeModal);
          mount(blockProductPage, productPage);
          mount(slider, blockCloseModal);
          connectSlider();
          eventModal(slider, blockCloseModal);

          btnAddToCart.addEventListener('click', async () => {
            setAttr(btnAddToCart, { disabled: true });

            btnAddToCart.classList.contains('btn-remove')
              ? this.deleteProduct(productId, btnAddToCart)
              : this.addProduct(productId, btnAddToCart);
          });
        })
        .catch((err) => console.error(err)),
    ]);

    return blockProductPage;
  }

  private changeBtn(productId: string, btn: HTMLElement): void {
    getCart().then((data) => {
      const result = !data
        ? false
        : data!.lineItems.map((el: { productId: string }) => el.productId).includes(productId);

      if (result) {
        btn.textContent = 'Remove from Cart';
        btn.classList.add('btn-remove');
      } else {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('btn-remove');
      }

      setAttr(btn, { disabled: false });
    });
  }

  private addProduct(productId: string, btn: HTMLElement): void {
    getCart().then((cartData) => {
      let cartId, cartVersion;

      if (!cartData) {
        createCart().then((data) => {
          cartId = data!.id;
          cartVersion = data!.version;

          addProductToCart(productId, cartId!, cartVersion).then((cart) => {
            if (cart === null) {
              throw new Error('Cart update expected');
            }
            this.changeBtn(productId, btn);
            updateHeaderItemsAmount(cart);
          });
        });
      } else {
        cartId = cartData.id;
        cartVersion = cartData.version;

        addProductToCart(productId, cartId, cartVersion).then((cart) => {
          if (cart === null) {
            throw new Error('Cart update expected');
          }
          this.changeBtn(productId, btn);
          updateHeaderItemsAmount(cart);
        });
      }
    });
  }

  private deleteProduct(productId: string, btn: HTMLElement): void {
    getCart().then((cartData) => {
      cartData!.lineItems.find((el: { productId: string; id: string; quantity: number }) => {
        el.productId === productId &&
          deleteProductFromCart(cartData!.id, cartData!.version, [getRemoveItemAction(el.id, el.quantity)]).then(
            (cart) => {
              if (cart === null) {
                throw new Error('Cart update expected');
              }
              this.changeBtn(productId, btn);
              updateHeaderItemsAmount(cart);
            }
          );
      });
    });
  }

  protected build(): HTMLElement {
    return this.createProductPage(this.productKey);
  }
}
