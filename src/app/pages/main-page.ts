import { el, text } from 'redom';
import { Page } from '@templates/page';
import logo from '@icons/logo.png';
import couponIcon from '@icons/coupon.png';
import balloonImage from '@images/foil-balloon.jpg';

class MainPage extends Page {
  protected textObject = {
    title: 'Main page',
    promoName: 'Buy 1 Get 1 FREE',
    promoDescription: 'On All Foil Balloons',
    promoCode: 'BOGO2023',
  };

  private createWelcomeBlock(): HTMLElement {
    const { promoName, promoDescription, promoCode } = this.textObject;

    return el(
      '.home-welcome',
      el('.welcome-content', [
        el('.welcome-top', [
          el('img.welcome-logo', { src: logo, alt: 'Logo' }),
          el(
            'p.welcome-text',
            text('We offer a large selection of modern and carefully curated party supplies.'),
            el('br'),
            text('Thanks for joining our party!')
          ),
        ]),
        el(
          '.welcome-bottom',
          el(
            '.welcome-promocode',
            { title: 'Add 2 foil balloons to your cart, apply the promo code and get the cheapest one as a gift' },
            [
              el('div.welcome-promocode-icon', el('img', { src: couponIcon, alt: '' })),
              el('.welcome-promocode-info', [
                el('h3.welcome-promocode-title', promoName),
                el('p', promoDescription),
                el('p', 'Use code: ', el('strong', promoCode)),
              ]),
              el('img.welcome-promocode-image', { src: balloonImage, alt: '' }),
            ]
          )
        ),
      ])
    );
  }

  protected build(): HTMLElement {
    return el('.home-page', [el('section.home-first-block-wrap', [this.createWelcomeBlock(), el('.home-categories')])]);
  }
}

export { MainPage };
