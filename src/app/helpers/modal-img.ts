import { safeQuerySelector } from '@helpers/safe-query-selector';

export function eventModal(elemenImg: HTMLElement, elemenClose: HTMLElement): void {
  const blockout = safeQuerySelector('.blockout');
  function eventImg(el: MouseEvent): void {
    const target = el.target as HTMLElement;
    if (
      !elemenImg.classList.contains('modal-active') &&
      !target.classList.contains('swiper-button-prev') &&
      !target.classList.contains('swiper-button-next')
    ) {
      elemenImg.classList.toggle('modal-active');
      elemenClose.classList.toggle('close-modal-active');
      document.body.style.overflow = 'hidden';
      blockout?.classList.toggle('blackout-active');
    }
    if (target.classList.contains('block-close-modal') || target.classList.contains('close-modal')) {
      elemenImg.classList.toggle('modal-active');
      elemenClose.classList.toggle('close-modal-active');
      document.body.style.overflow = 'scroll';
      blockout?.classList.toggle('blackout-active');
    }
  }

  elemenImg.addEventListener('click', eventImg);
}
