import { safeQuerySelector } from '@helpers/safe-query-selector';

export function eventModal(blockSlider: HTMLElement, elementExit: HTMLElement): void {
  const blackout = safeQuerySelector('.blackout');

  function eventImg(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      !blockSlider.classList.contains('modal-active') &&
      !target.classList.contains('swiper-button-prev') &&
      !target.classList.contains('swiper-button-next')
    ) {
      blockSlider.classList.toggle('modal-active');
      elementExit.classList.toggle('exit-modal-active');
      document.body.style.overflow = 'hidden';
      blackout?.classList.toggle('blackout-active');
    }
    if (target.classList.contains('block-exit-modal') || target.classList.contains('exit-modal')) {
      blockSlider.classList.toggle('modal-active');
      elementExit.classList.toggle('exit-modal-active');
      document.body.style.overflow = 'scroll';
      blackout?.classList.toggle('blackout-active');
    }
  }

  blockSlider.addEventListener('click', eventImg);
}
