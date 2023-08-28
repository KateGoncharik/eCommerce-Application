import { Page } from '@templates/page';
import { el, mount } from 'redom';
import { getProducts } from '@sdk/requests';
import { ProductCard } from '@components/product-card';
import { extractProductData } from '@helpers/products';

class CatalogPage extends Page {
  protected textObject = {
    title: 'Catalog',
  };

  private createProductsContainer(): HTMLElement {
    const container = el('.products');
    extractProductData(getProducts()).then((products) => {
      products.forEach((product) => {
        const card = new ProductCard(product).create();
        mount(container, card);
      });
    });
    return container;
  }

  protected build(): HTMLElement {
    return el('section.catalog', el('.catalog-sidebar', 'Categories'), this.createProductsContainer());
  }
}

export { CatalogPage };
