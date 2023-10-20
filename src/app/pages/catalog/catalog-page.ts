import { Page } from '@templates/page';
import { NotFoundPage } from '@servicePages/404-page';
import { el, mount, setChildren } from 'redom';
import { ProductProjection, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { FiltersBlock } from '@components/filters-block';
import { Pagination } from '@components/pagination';
import { ProductCard } from '@components/product-card';
import { showLoadingScreen } from '@helpers/loading';
import { buildCategoriesObject } from '@helpers/build-categories-object';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { getProducts, getCategories, getProductsOfCategory, getCategoryByKey, getCart } from '@sdk/requests';
import { router } from '@app/router';
import magnifier from '@icons/magnifying-glass.svg';
import notFoundIcon from '@icons/nothing-found.png';

class CatalogPage extends Page {
  constructor(public categoryKey?: string) {
    super();
  }
  public productCount = 0;

  public filtersBlock = new FiltersBlock(this);
  public pagination = new Pagination(this);

  public productsContainer = el('.products');
  public sideBar = el('.catalog-sidebar');
  public searchInput = el('input.catalog-search-input', {
    placeholder: 'Search...',
  });
  protected textObject = {
    title: 'Catalog',
  };
  private mask = el('.catalog-mask');

  public createProductContainer(): HTMLElement {
    this.switchToFirstPage();
    showLoadingScreen(this.productsContainer);

    this.getRelevantProducts().then((products) => {
      if (!products) {
        new NotFoundPage().render();
      }
      this.fillProductsContainer(products);
    });
    return this.productsContainer;
  }

  public listenTitleClick(title: HTMLElement): void {
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

  public fillProductsContainer(products: ProductProjection[]): void {
    this.pagination.toggleBtnsState(this.pagination.currentPage.get());

    if (!products.length) {
      this.productsContainer.classList.add('not-found');
      const notFoundMessage = el('.catalog-not-found-message', 'No products found', el('img', { src: notFoundIcon }));
      setChildren(this.productsContainer, [notFoundMessage]);
      return;
    } else {
      this.productsContainer.classList.remove('not-found');

      getCart().then((cart) => {
        this.productsContainer.innerHTML = '';
        products.forEach((product) => {
          const card = new ProductCard(product).create();
          const isProductInCart = cart?.lineItems.some((item) => item.productId === product.id);
          if (isProductInCart) {
            card.classList.add('in-cart');
          }
          mount(this.productsContainer, card);
        });
        router.updatePageLinks();
      });
    }
  }

  private async getRelevantProducts(): Promise<ProductProjection[]> {
    const offset = this.pagination.calculateOffset();
    let request: ProductProjectionPagedQueryResponse | null;

    if (this.categoryKey) {
      const category = await getCategoryByKey(this.categoryKey);
      if (!category) {
        return [];
      }
      request = await getProductsOfCategory(category.id, offset);
    } else {
      request = await getProducts(offset);
    }
    this.productCount = request?.total || 0;
    return request?.results || [];
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

  private createSearch(): HTMLElement {
    const { searchInput } = this;

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput instanceof HTMLInputElement) {
        if (!searchInput.value.trim().length) {
          this.filtersBlock.applyFilters();
          return;
        }
        const searchQuery = searchInput.value
          .trim()
          .toLowerCase()
          .split(' ')
          .map((userQuery) => `"${userQuery}"`)
          .join(',');

        this.filtersBlock.applyFilters(searchQuery);
        this.switchToFirstPage();
      }
    });

    return el('.catalog-search', [
      searchInput,
      el('img.catalog-search-icon', {
        src: magnifier,
      }),
    ]);
  }

  private createCategoryList(): HTMLElement {
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

  protected build(): HTMLElement {
    setChildren(this.sideBar, [this.createCategoryList(), this.filtersBlock.create()]);

    return el('section.catalog', [
      this.mask,
      this.sideBar,
      el('.products-wrapper', [
        el('.breadcrumbs-search-wrap', [this.createBreadcrumbs(), this.createSearch()]),
        this.createProductContainer(),
        this.pagination.create(),
      ]),
    ]);
  }

  public switchToFirstPage(): void {
    this.pagination.currentPage.set(1);
    this.pagination.pageNumberItem.textContent = '1';
  }
}

export { CatalogPage };
