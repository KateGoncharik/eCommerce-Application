import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { Button } from '@components/button';
import { Route } from '@app/types/route';
import lottie from 'lottie-web';
import animation404 from '@animation/404-anim.json';
import { safeQuerySelector } from '@helpers/safe-query-selector';

class NotFoundPage extends Page {
  protected textObject = {
    title: 'PAGE NOT FOUND',
  };

  protected createTitle(): HTMLHeadingElement {
    const title = super.createTitle();
    title.classList.add('title-404');
    return title;
  }

  protected createLinkToMain(): HTMLElement {
    const button = new Button('Back to home', 'black').render();
    const link = el('a.404-link-to-main', {
      href: Route.Main,
      'data-navigo': '',
    });
    link.addEventListener('click', () => this.showOrHideHeader('show'));
    mount(link, button);
    return link;
  }

  protected createAnimItem(): HTMLElement {
    const animItem = el('div.anim-item-404');
    lottie.loadAnimation({
      container: animItem, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation404,
    });
    return animItem;
  }

  protected showOrHideHeader(act: 'show' | 'hide'): void {
    const header = safeQuerySelector('.header');
    if (act === 'show') {
      header.style.display = 'block';
    } else {
      header.style.display = 'none';
    }
  }

  protected build(): HTMLElement {
    this.showOrHideHeader('hide');
    return el('section.page-404', [this.createAnimItem(), this.createTitle(), this.createLinkToMain()]);
  }
}

export { NotFoundPage };
