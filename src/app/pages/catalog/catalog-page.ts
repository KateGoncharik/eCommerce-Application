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

    this.listenTitleClick(title);

    buildCategoriesObject(getCategories()).then((categoriesObject) => {
      Object.values(categoriesObject).forEach((category) => {
        const subcategoriesList = el('ul.subcategories-list');
        const categoryName = el('.category-name', [
          el('a', category.name, {
            href: `/catalog/${category.key}`,
            'data-navigo': '',
          }),
          el('span', '▶'),
        ]);
        const categoryItem = el('li', [categoryName, subcategoriesList]);

        this.toggleActiveOnClick(categoryName);

        category.subcategories.forEach((subcategory) => {
          const subcategoryName = el('a.subcategory-name', subcategory.name, {
            href: `/catalog/${category.key}/${subcategory.key}`,
            'data-navigo': '',
          });
          const subcategoryItem = el('li', [subcategoryName]);

          mount(subcategoriesList, subcategoryItem);
        });

        mount(categoriesList, categoryItem);
        mount(container, categoriesList);
      });
      router.updatePageLinks();
    });

    this.toggleActiveOnClick(title);
    this.categoryNav = container;
    return container;
  }

  private listenTitleClick(title: HTMLElement): void {
    const m_width768 = window.matchMedia('(max-width: 768px)');

    title.addEventListener('click', () => {
      if (m_width768.matches) {
        const mask = safeQuerySelector('.categories-mask');
        mask.classList.toggle('lock');
        document.body.classList.toggle('lock');
      }
    });
    m_width768.addEventListener('change', () => {
      const mask = safeQuerySelector('.categories-mask');
      mask.classList.remove('lock');
      document.body.classList.remove('lock');
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
