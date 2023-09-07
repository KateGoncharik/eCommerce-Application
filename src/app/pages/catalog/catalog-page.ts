import { Page } from '@templates/page';
import { NotFoundPage } from '@servicePages/404-page';
import { el, mount, unmount, setChildren } from 'redom';
import {
  getProducts,
  getCategories,
  getProductsOfCategory,
  getCategoryByKey,
  getFilteredProducts,
} from '@sdk/requests';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductMainData } from '@customTypes/catalog';
import { Colors } from '@customTypes/enums';
import { ProductCard } from '@components/product-card';
import { Button } from '@components/button';
import { extractProductData, buildCategoriesObject } from '@helpers/catalog';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { router } from '@app/router';

class CatalogPage extends Page {
  constructor(public categoryKey?: string) {
    super();
  }

  protected textObject = {
    title: 'Catalog',
  };

  private productsContainer = el('.products');
  private sideBar = el('.catalog-sidebar');
  private mask = el('.catalog-mask');
  private minPrice = 0;
  private maxPrice = 5;
  private priceFrom = this.minPrice;
  private priceTo = this.maxPrice;
  private filtersPriceBlock = el('.filters-unit');
  private filtersColorBlock = el('.filters-unit');
  private colorCircles: HTMLElement[] = [];

  protected createProductContainer(): HTMLElement {
    this.getProductData().then((products) => {
      if (!products) {
        new NotFoundPage().render();
      }
      this.fillProductsContainer(products);
    });
    return this.productsContainer;
  }

  private async getProductData(): Promise<ProductMainData[]> {
    let products: Promise<ProductProjection[]>;

    if (this.categoryKey) {
      const category = await getCategoryByKey(this.categoryKey);
      if (!category) {
        return [];
      }
      products = getProductsOfCategory(category.id);
    } else {
      products = getProducts();
    }
    return extractProductData(products);
  }

  private createBreadcrumbs(): HTMLElement {
    const container = el('.breadcrumbs');

    setTimeout(() => {
      const path = window.location.pathname;
      const pathArray = path.split('/');
      let url = '';

      pathArray.forEach((path, i) => {
        let link: HTMLElement;
        const linkText = path.slice(0, 1).toUpperCase() + path.slice(1).replace(/-/g, ' ') || 'Home';
        url = i === 1 ? `${url}${path}` : `${url}/${path}`;

        if (i !== pathArray.length - 1) {
          link = el('a.breadcrumbs-link', linkText, {
            href: url,
            'data-navigo': '',
          });
        } else {
          link = el('span.breadcrumbs-current', linkText);
        }
        mount(container, link);
        router.updatePageLinks();
      });
    });
    return container;
  }

  protected createCategoryList(): HTMLElement {
    const title = el('h3.categories-title.sidebar-dropdown-title', [el('span', 'Categories')]);
    const container = el('.categories', title);
    const categoriesList = el('ul.sidebar-dropdown-content');

    buildCategoriesObject(getCategories()).then((categoriesObject) => {
      Object.values(categoriesObject).forEach((category) => {
        const subcategoriesList = el('ul.subcategories-list');
        const categoryLink = el('a', category.name, {
          href: `/catalog/${category.key}`,
          'data-navigo': '',
        });
        const categoryName = el('.category-name', [categoryLink, el('span', '▶')]);
        const categoryItem = el('li', [categoryName, subcategoriesList]);

        if (category.key === this.categoryKey) {
          categoryLink.classList.add('active');
        }
        this.toggleActiveOnClick(categoryName);

        category.subcategories.forEach((subcategory) => {
          const subcategoryLink = el('a.subcategory-name', subcategory.name, {
            href: `/catalog/${category.key}/${subcategory.key}`,
            'data-navigo': '',
          });
          const subcategoryItem = el('li', [subcategoryLink]);

          if (subcategory.key === this.categoryKey) {
            subcategoryLink.classList.add('active');
          }
          mount(subcategoriesList, subcategoryItem);
        });

        mount(categoriesList, categoryItem);
        mount(container, categoriesList);
      });
      this.listenTitleClick(title);
      router.updatePageLinks();
    });
    return container;
  }

  private listenTitleClick(title: HTMLElement): void {
    const windowSize = window.matchMedia('(max-width: 768px)');
    const mask = this.mask;
    let isAllTitlesInactive: boolean;

    title.addEventListener('click', () => {
      title.classList.toggle('active');
      const titles = document.querySelectorAll('.sidebar-dropdown-title');

      titles.forEach((item) => {
        if (item !== title) {
          item.classList.remove('active');
        } else if (item.classList.contains('active')) {
          isAllTitlesInactive = false;
        } else {
          isAllTitlesInactive = true;
        }
      });
      if (windowSize.matches) {
        if (isAllTitlesInactive) {
          mask.classList.remove('lock');
          document.body.classList.remove('no-scroll');
        } else {
          mask.classList.add('lock');
          document.body.classList.add('no-scroll');
        }
      }
    });
    windowSize.addEventListener('change', () => {
      this.closeCategoryNav(title, mask);
    });
    this.closeCategoryNavOnBurgerClick(title, mask);
  }

  private closeCategoryNav(title: HTMLElement, mask: HTMLElement): void {
    title.classList.remove('active');
    mask.classList.remove('lock');
    document.body.classList.remove('no-scroll');
  }

  private closeCategoryNavOnBurgerClick(title: HTMLElement, mask: HTMLElement): void {
    const burger = safeQuerySelector('.burger');

    burger.addEventListener('click', () => {
      this.closeCategoryNav(title, mask);
    });
  }

  private toggleActiveOnClick(element: HTMLElement): void {
    element.addEventListener('click', () => {
      element.classList.toggle('active');
    });
  }

  private createFiltersBlock(): HTMLElement {
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
      this.applyFilters();
    });
    resetBtn.addEventListener('click', () => {
      if (!this.isPriceFiltersApplied() && !this.isColorFiltersApplied()) {
        return;
      }
      unmount(this.sideBar, container);
      mount(this.sideBar, this.createFiltersBlock());
      this.createProductContainer();
    });
    this.listenTitleClick(title);
    router.updatePageLinks();
    return container;
  }

  private async applyFilters(): Promise<void> {
    const queryArgs = this.assembleQueryArgs();
    if (!queryArgs.length) {
      return;
    }
    if (this.categoryKey) {
      const category = await getCategoryByKey(this.categoryKey);
      queryArgs.push(`categories.id:"${category?.id}"`);
    }
    const products = await extractProductData(getFilteredProducts(queryArgs));
    this.fillProductsContainer(products);
  }

  private fillProductsContainer(products: ProductMainData[]): void {
    this.productsContainer.innerHTML = '';
    products.forEach((product) => {
      const card = new ProductCard(product).create();
      mount(this.productsContainer, card);
    });
    router.updatePageLinks();
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
    const thumbFrom = el('input#from', { type: 'range', min: this.minPrice, value: '0', max: this.maxPrice });
    const thumbTo = el('input#to', { type: 'range', min: this.minPrice, value: '5', max: this.maxPrice });

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
      circle.addEventListener('click', () => {
        circle.classList.toggle('active');
      });
      this.colorCircles.push(circle);
    }
    setChildren(this.filtersColorBlock, [
      el('h4.filters-colors-title.filters-unit-title', 'Colors'),
      el('.filters-colors-content', this.colorCircles),
    ]);
    return this.filtersColorBlock;
  }

  protected build(): HTMLElement {
    setChildren(this.sideBar, [this.createCategoryList(), this.createFiltersBlock()]);

    return el('section.catalog', [
      this.mask,
      this.sideBar,
      el('.products-wrapper', [this.createBreadcrumbs(), this.createProductContainer()]),
    ]);
  }
}

export { CatalogPage };
