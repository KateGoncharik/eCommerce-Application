import { Page } from '@templates/page';
import { getProduct } from '@sdk/requests';
import { el, mount } from 'redom';
import { ProductData } from '@app/types/data-product';
import { slider } from '@helpers/slider';

export class ProductPage extends Page {
  protected textObject = {
    title: 'Product page',
  };

  private createSlider(userData: ProductData): HTMLElement {
    const slider = el('.swiper');
    const swiperWrapper = el('.swiper-wrapper');
    const btnPrev = el('.swiper-button-prev');
    const btnNext = el('.swiper-button-next');
    const scrollbar = el('.swiper-scrollbar');

    mount(slider, btnPrev);
    mount(slider, btnNext);
    mount(slider, scrollbar);

    for (let i = 0; i < userData!.img.length; i++) {
      const swiperSlide = el('.swiper-slide');
      const img = el('img.product-img', { src: userData!.img[i].url });

      mount(swiperSlide, img);
      mount(swiperWrapper, swiperSlide);
      mount(slider, swiperWrapper);
    }

    return slider;
  }

  private createProductPage(): HTMLElement {
    const blockProductPage = el('.block-product-page', [
      getProduct('pink-and-blue-tissue-garland')
        .then((userData) => {
          const productPage = el('.product-page', [
            el('.block-product-img', [this.createSlider(userData!)]),
            el('.block-product-info', [
              el('h3.product-name', userData!.name),
              el('p.product-description', userData!.description),
            ]),
          ]);

          mount(blockProductPage, productPage);
          slider();
        })
        .catch((err) => console.log(err)),
    ]);

    return blockProductPage;
  }

  protected build(): HTMLElement {
    return this.createProductPage();
  }
}
