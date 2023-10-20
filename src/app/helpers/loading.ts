import { el, setChildren } from 'redom';
import lottie from 'lottie-web';
import loadIndicator from '@animation/load-indicator.json';

function createLoadAnimItem(className?: string): HTMLElement {
  const animItem = el(`.${className}`);

  lottie.loadAnimation({
    container: animItem,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadIndicator,
  });
  return animItem;
}

function showLoadingScreen(container: HTMLElement): void {
  const loadingScreen = el('.loading-screen', [createLoadAnimItem('products-load-anim'), el('p', 'Loading...')]);
  setChildren(container, [loadingScreen]);
}

export { showLoadingScreen, createLoadAnimItem };
