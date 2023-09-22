import { el } from 'redom';
import { CatalogPageType } from '@customTypes/catalog';
import { productsPerPage, getProducts } from '@sdk/requests';

class Pagination {
  private firstPageButton = el('.pagination-controls', '<<');
  private prevPageButton = el('.pagination-controls', '<');
  private nextPageButton = el('.pagination-controls', '>');
  private lastPageButton = el('.pagination-controls', '>>');

  constructor(private catalog: CatalogPageType) {}

  private getLastPage = async (): Promise<number> => {
    const { productCount } = this.catalog;
    if (!productCount) {
      const request = await getProducts();
      this.catalog.productCount = request?.total || 0;
    }
    return Math.ceil(productCount / productsPerPage);
  };

  private async goToPage(pageNumber: number): Promise<void> {
    const offset = this.calculateOffset(pageNumber);
    await this.catalog.filtersBlock.applyFilters(null, offset);
    this.pageNumberItem.textContent = pageNumber.toString();
    this.currentPage.set(pageNumber);
    this.toggleBtnsState(pageNumber);
  };

  public currentPage = {
    get(): number {
      return Number(localStorage.getItem('catalog-current-page')) || 1;
    },
    set(value: number): void {
      localStorage.setItem('catalog-current-page', value.toString());
    },
  };

  public create(): HTMLElement {
    const { firstPageButton, prevPageButton, pageNumberItem, nextPageButton, lastPageButton } = this;

    firstPageButton.addEventListener('click', async () => {
      if (firstPageButton.classList.contains('inactive')) {
        return;
      }
      await this.goToPage(1);
    });
    prevPageButton.addEventListener('click', async () => {
      if (prevPageButton.classList.contains('inactive')) {
        return;
      }
      const prevPage = this.currentPage.get() - 1;
      await this.goToPage(prevPage);
    });
    nextPageButton.addEventListener('click', async () => {
      if (nextPageButton.classList.contains('inactive')) {
        return;
      }
      const nextPage = this.currentPage.get() + 1;
      await this.goToPage(nextPage);
    });
    lastPageButton.addEventListener('click', async () => {
      if (lastPageButton.classList.contains('inactive')) {
        return;
      }
      const lastPage = await this.getLastPage();
      await this.goToPage(lastPage);
    });
    return el('.catalog-pagination', [firstPageButton, prevPageButton, pageNumberItem, nextPageButton, lastPageButton]);
  }

  public pageNumberItem = el('.pagination-controls.pagination-page-num', this.currentPage.get());

  public calculateOffset(pageNumber = this.currentPage.get()): number {
    return (pageNumber - 1) * productsPerPage;
  }

  public async toggleBtnsState(pageNumber: number): Promise<void> {
    const { firstPageButton, prevPageButton, nextPageButton, lastPageButton } = this;
    const makeActive = (...buttons: HTMLElement[]): void => {
      buttons.forEach((button) => {
        button.classList.remove('inactive');
      });
    };
    const makeInactive = (...buttons: HTMLElement[]): void => {
      buttons.forEach((button) => {
        button.classList.add('inactive');
      });
    };
    if (pageNumber > 1) {
      makeActive(firstPageButton, prevPageButton);
    } else {
      makeInactive(firstPageButton, prevPageButton);
    }
    if (pageNumber < (await this.getLastPage())) {
      makeActive(nextPageButton, lastPageButton);
    } else {
      makeInactive(nextPageButton, lastPageButton);
    }
  }

}

export { Pagination };
