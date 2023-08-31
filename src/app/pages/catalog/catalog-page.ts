import { Page } from '@templates/page';
import { NotFoundPage } from '@servicePages/404-page';
import { el, mount } from 'redom';
import { getProducts, getCategories, getProductsOfCategory, getCategoryByKey } from '@sdk/requests';
import { ProductCard } from '@components/product-card';
import { extractProductData, buildCategoriesObject } from '@helpers/catalog';
import { safeQuerySelector } from '@helpers/safe-query-selector';
import { router } from '@app/router';

class CatalogPage extends Page {
  constructor(public categoryKey?: string) {
    super();
  }

  public static current: CatalogPage;

  public updateProductsContainer(): HTMLElement {
    this.productsContainer.innerHTML = '';

    if (!this.categoryKey) {
      return this.productsContainer;
    }
    getCategoryByKey(this.categoryKey)
      .then((category) => {
        if (!category) {
          return;
        }
        const products = getProductsOfCategory(category.id);
        return extractProductData(products);
      })
      .then((products) => {
        if (!products) {
          new NotFoundPage().render();
        }
        products?.forEach((product) => {
          const card = new ProductCard(product).create();
          mount(this.productsContainer, card);
        });
      });
    return this.productsContainer;
  }

  protected textObject = {
    title: 'Catalog',
  };

  protected categoryNav: HTMLElement | null = null;

  private activeCategoryLink: HTMLElement | null = null;

  private productsContainer: HTMLElement = el('.products');

  protected createProductsContainer(): HTMLElement {
    const products = getProducts();

    extractProductData(products).then((products) => {
      products.forEach((product) => {
        const card = new ProductCard(product).create();
        mount(this.productsContainer, card);
      });
    });
    return this.productsContainer;
  }

  protected createCategoryList(): HTMLElement {
    const title = el('h3.categories-title', [el('span', 'Categories')]);
    const container = el('.categories', [el('.categories-mask'), title]);
    const categoriesList = el('ul.categories-list');

    buildCategoriesObject(getCategories()).then((categoriesObject) => {
      Object.values(categoriesObject).forEach((category) => {
        const subcategoriesList = el('ul.subcategories-list');
        const categoryLink = el('a', category.name, {
          href: `/catalog/${category.key}`,
          'data-navigo': '',
        });
        const categoryName = el('.category-name', [categoryLink, el('span', '▶')]);
        const categoryItem = el('li', [categoryName, subcategoriesList]);

        this.handleCategoryLinkClick(categoryLink, title);
        this.toggleActiveOnClick(categoryName);

        category.subcategories.forEach((subcategory) => {
          const subcategoryLink = el('a.subcategory-name', subcategory.name, {
            href: `/catalog/${category.key}/${subcategory.key}`,
            'data-navigo': '',
          });
          const subcategoryItem = el('li', [subcategoryLink]);

          this.handleCategoryLinkClick(subcategoryLink, title);
          mount(subcategoriesList, subcategoryItem);
        });

        mount(categoriesList, categoryItem);
        mount(container, categoriesList);
      });
      this.listenTitleClick(title);
      router.updatePageLinks();
    });
    this.categoryNav = container;
    return container;
  }

  private handleCategoryLinkClick(link: HTMLElement, title: HTMLElement): void {
    link.addEventListener('click', () => {
      if (this.activeCategoryLink) {
        this.activeCategoryLink.classList.remove('active');
      }
      link.classList.add('active');
      this.activeCategoryLink = link;

      if (window.matchMedia('(max-width: 768px)').matches) {
        this.closeCategoryNav(title, safeQuerySelector('.categories-mask'));
      }
    });
  }

  private listenTitleClick(title: HTMLElement): void {
    const windowSize = window.matchMedia('(max-width: 768px)');
    const mask = safeQuerySelector('.categories-mask');

    title.addEventListener('click', () => {
      title.classList.toggle('active');

      if (windowSize.matches) {
        mask.classList.toggle('lock');
        document.body.classList.toggle('no-scroll');
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

  protected build(): HTMLElement {
    CatalogPage.current = this;
    const productsContainer = this.categoryKey ? this.updateProductsContainer() : this.createProductsContainer();
    const categoryNav = this.categoryNav ? this.categoryNav : this.createCategoryList();
    const container = el('section.catalog', el('.catalog-sidebar', [categoryNav]), productsContainer);
    return container;
  }
}

export { CatalogPage };
