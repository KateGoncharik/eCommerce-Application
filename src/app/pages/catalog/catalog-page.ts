import { Page } from '@templates/page';
import { NotFoundPage } from '@servicePages/404-page';
import { el, mount } from 'redom';
import { getProducts, getCategories, getProductsOfCategory, getCategoryByKey } from '@sdk/requests';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductMainData } from '@customTypes/catalog';
import { ProductCard } from '@components/product-card';
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

  protected createProductContainer(): HTMLElement {
    const productsContainer = el('.products');

    this.getProductData().then((products) => {
      if (!products) {
        new NotFoundPage().render();
      }
      products.forEach((product) => {
        const card = new ProductCard(product).create();
        mount(productsContainer, card);
      });
      router.updatePageLinks();
    });
    return productsContainer;
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
    return el('section.catalog', [
      el('.catalog-sidebar', this.createCategoryList()),
      el('.products-wrapper', [this.createBreadcrumbs(), this.createProductContainer()]),
    ]);
  }
}

export { CatalogPage };
