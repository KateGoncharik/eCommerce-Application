import { el, text, mount } from 'redom';
import { router } from '@app/router';
import { Page } from '@templates/page';
import logo from '@icons/logo.png';
import couponIcon from '@icons/coupon.png';
import balloonImage from '@images/foil-balloon.jpg';
import { showLoadingScreen } from '@helpers/loading';
import { getCategories, getProductsOfCategory } from '@sdk/requests';

class MainPage extends Page {
  protected textObject = {
    title: 'Main page',
    promoName: 'Buy 1 Get 1 FREE',
    promoDescription: 'On All Foil Balloons',
    promoCode: 'BOGO2023',
  };

  protected build(): HTMLElement {
    return el('.home-page', [
      el('section.home-first-block-wrap', [this.createWelcomeBlock(), this.createCategoriesBlock()]),
    ]);
  }

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

  private createCategoriesBlock(): HTMLElement {
    const categoriesContainer = el('.home-categories');
    let counter = 0;

    showLoadingScreen(categoriesContainer);

    getCategories().then((categories) => {
      categoriesContainer.innerHTML = '';
      if (!categories) {
        return;
      }
      categories.forEach(async (category) => {
        if (category.ancestors.length) {
          return;
        }
        const products = await getProductsOfCategory(category.id);
        const image = products?.results[0]?.masterVariant.images?.[0].url;
        const card = el(
          '.category-card',
          el('.category-card-content', [
            el('.category-card-description', [
              el('h4.category-card-title', category.name['en-US']),
              el('a.category-card-link', 'shop now', { href: `/catalog/${category.key}`, 'data-navigo': '' }),
            ]),
            el(
              'a.category-card-image',
              { href: `/catalog/${category.key}`, 'data-navigo': '' },
              el('img', { src: image, alt: category.name })
            ),
          ])
        );
        if (counter % 2) {
          card.classList.add('reverse');
        }
        mount(categoriesContainer, card);
        router.updatePageLinks();
        counter++;
      });
    });
    return categoriesContainer;
  }
}

export { MainPage };
