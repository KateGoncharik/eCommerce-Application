import { Button } from '@components/button';
import { el, mount, unmount, setChildren } from 'redom';
import { router } from '@app/router';
import { getCategoryByKey, getFilteredProducts, getProducts } from '@sdk/requests';
import { CatalogPageType } from '@customTypes/catalog';
import { Colors } from '@customTypes/enums';

class FiltersBlock {
  constructor(private catalog: CatalogPageType) {}

  private minPrice = 0;
  private maxPrice = 100;
  private priceFrom = this.minPrice;
  private priceTo = this.maxPrice;
  private filtersPriceBlock = el('.filters-unit');
  private filtersColorBlock = el('.filters-unit');
  private colorCircles: HTMLElement[] = [];

  public create(): HTMLElement {
    const title = el('h3.filters-title.sidebar-dropdown-title', [el('span', 'Filters')]);
    const applyBtn = new Button('Apply', 'black').render();
    const resetBtn = new Button('Reset', 'black').render();
    const priceFilters = this.createPriceRange();
    const colorFilters = this.createColorFiltersBlock();

    priceFilters?.classList.remove('applied');
    colorFilters.classList.remove('applied');

    const container = el('.filters', [
      title,
      el('.sidebar-dropdown-content', [priceFilters, colorFilters, el('.filters-buttons', [resetBtn, applyBtn])]),
    ]);
    applyBtn.addEventListener('click', () => {
      this.catalog.switchToFirstPage();
      this.applyFilters();
    });
    resetBtn.addEventListener('click', () => {
      if (!this.isPriceFiltersApplied() && !this.isColorFiltersApplied()) {
        return;
      }
      this.priceFrom = this.minPrice;
      this.priceTo = this.maxPrice;
      unmount(this.catalog.sideBar, container);
      mount(this.catalog.sideBar, this.create());
      this.catalog.createProductContainer();
    });
    this.catalog.listenTitleClick(title);
    router.updatePageLinks();
    return container;
  }

  public async applyFilters(userQuery?: string | null, offset = 0): Promise<void> {
    this.catalog.showLoadingScreen();

    const queryArgs = this.assembleQueryArgs();

    if (userQuery) {
      queryArgs.push(`searchKeywords.en-US.text:${userQuery}`);
    }
    if (this.catalog.categoryKey) {
      const category = await getCategoryByKey(this.catalog.categoryKey);
      queryArgs.push(`categories.id:"${category?.id}"`);
    }
    const request = queryArgs.length ? await getFilteredProducts(queryArgs, offset) : await getProducts(offset);
    const products = request?.results || [];
    this.catalog.productCount = request?.total || 0;
    this.catalog.fillProductsContainer(products);
  }

  private assembleQueryArgs(): string[] {
    const queryArgs: string[] = [];

    if (this.isPriceFiltersApplied()) {
      this.filtersPriceBlock.classList.add('applied');
      queryArgs.push(`variants.price.centAmount:range (${this.priceFrom * 100} to ${this.priceTo * 100})`);
    } else {
      this.filtersPriceBlock.classList.remove('applied');
    }
    if (this.isColorFiltersApplied()) {
      const selectedColors = this.colorCircles
        .filter((circle) => circle.classList.contains('active'))
        .map((circle) => `"${circle.getAttribute('data-color')}"`)
        .join(',');

      this.filtersColorBlock.classList.add('applied');
      queryArgs.push(`variants.attributes.color.key:${selectedColors}`);
    } else {
      this.filtersColorBlock.classList.remove('applied');
    }
    return queryArgs;
  }

  private isPriceFiltersApplied(): boolean {
    return this.priceFrom !== this.minPrice || this.priceTo !== this.maxPrice;
  }

  private isColorFiltersApplied(): boolean {
    return this.colorCircles.some((circle) => circle.classList.contains('active'));
  }

  private createPriceRange(): HTMLElement | void {
    const thumbFrom = el('input#from', { type: 'range', min: this.minPrice, value: this.minPrice, max: this.maxPrice });
    const thumbTo = el('input#to', { type: 'range', min: this.minPrice, value: this.maxPrice, max: this.maxPrice });

    if (!(thumbFrom instanceof HTMLInputElement) || !(thumbTo instanceof HTMLInputElement)) {
      return;
    }

    [thumbFrom, thumbTo].forEach((thumb) => {
      thumb.addEventListener('input', () => {
        const priceWrap = thumb.parentElement;
        if (!(thumb instanceof HTMLInputElement)) {
          return;
        }
        priceWrap?.style.setProperty(`--${thumb.id}`, thumb.value);

        this.priceFrom = Math.min(+thumbFrom.value, +thumbTo.value);
        this.priceTo = Math.max(+thumbFrom.value, +thumbTo.value);
      });
    });
    setChildren(this.filtersPriceBlock, [
      el('h4.filters-unit-title', 'Price'),
      el('.filters-price-wrap', [
        thumbFrom,
        el('output.price-output-from', { for: 'from' }),
        thumbTo,
        el('output.price-output-to', { for: 'to' }),
      ]),
    ]);
    return this.filtersPriceBlock;
  }

  private createColorFiltersBlock(): HTMLElement {
    this.colorCircles = [];
    for (const [color, hex] of Object.entries(Colors)) {
      const circle = el('.filters-color-circle', { style: `background-color: ${hex}`, 'data-color': color });
      this.colorCircles.push(circle);
    }
    const gradientCircle = el('.filters-color-circle.filters-gradient-circle', {
      'data-color': 'Gradient',
    });
    const rainbowCircle = el('.filters-color-circle.filters-rainbow-circle', {
      'data-color': 'Rainbow',
    });
    const multicolorCircle = el('.filters-color-circle.filters-multicolor-circle', {
      'data-color': 'Multicolor',
    });
    this.colorCircles.push(gradientCircle, rainbowCircle, multicolorCircle);

    this.colorCircles.forEach((circle) => {
      circle.addEventListener('click', () => {
        circle.classList.toggle('active');
      });
    });

    setChildren(this.filtersColorBlock, [
      el('h4.filters-colors-title.filters-unit-title', 'Colors'),
      el('.filters-colors-content', this.colorCircles),
    ]);
    return this.filtersColorBlock;
  }
}

export { FiltersBlock };
