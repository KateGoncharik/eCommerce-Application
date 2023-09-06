import SwiperBundle from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';

export function connectSlider(): void {
  const swiper = new SwiperBundle('.swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 'auto',
    direction: 'horizontal',
    loop: true,

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

  swiper;
}
