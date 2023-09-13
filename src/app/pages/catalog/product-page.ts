import { Page } from '@templates/page';
import { getProduct, getCartTest, createCart, addCartTest } from '@sdk/requests';
import { el, mount, setAttr } from 'redom';
import { ProductData } from '@app/types/data-product';
import { connectSlider } from '@helpers/slider';
import { eventModal } from '@helpers/modal-img';

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
    const btnAdd = el('button.btn-product');

    setAttr(btnAdd, { style: { color: 'red' } });
    const addBlock = el('.block-add', [btnAdd]);
    const blockProductPage = el('.block-product-page', [
      el('.blackout'),
      getProduct(key)
        .then((productData) => {
          const slider = this.createSlider(productData!);
          const blockImg = el('.block-product-img', [slider]);

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

          btnAdd.addEventListener('click', () => {
            console.log('click');
            getCartTest().then(async (data) => {
              // creates a bucket if it is not
              console.log('getCart', data);
              console.log(data!.body.results.length === 0);
              data!.body.results.length === 0 && createCart();
              getProduct(key).then((dataProd) => {
                addCartTest(dataProd!.id, data!.body.results[0].id);
              });
            });
          });
        })
        .catch((err) => console.error(err)),
    ]);

    return blockProductPage;
  }

  protected build(): HTMLElement {
    return this.createProductPage(this.productKey);
  }
}
