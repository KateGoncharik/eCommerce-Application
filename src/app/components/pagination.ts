import { el } from 'redom';
import { CatalogPageType } from '@customTypes/catalog';
import { productsPerPage, getProducts } from '@sdk/requests';

class Pagination {
  constructor(private catalog: CatalogPageType) {}

  public productCount = 0;

  private currentPage = {
    get(): number {
      return Number(localStorage.getItem('catalog-current-page')) || 1;
    },
    set(value: number): void {
      localStorage.setItem('catalog-current-page', value.toString());
    },
  };

  private firstPageButton = el('.pagination-controls', '<<');
  private prevPageButton = el('.pagination-controls', '<');
  private pageNumberItem = el('.pagination-controls.pagination-page-num', this.currentPage.get());
  private nextPageButton = el('.pagination-controls', '>');
  private lastPageButton = el('.pagination-controls', '>>');

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
      const lastPage = await this.getLastPage();
      if (lastPageButton.classList.contains('inactive')) {
        return;
      }
      await this.goToPage(lastPage);
    });
    this.toggleBtnsState(this.currentPage.get());
    return el('.catalog-pagination', [firstPageButton, prevPageButton, pageNumberItem, nextPageButton, lastPageButton]);
  }

  public calculateOffset(pageNumber = this.currentPage.get()): number {
    return (pageNumber - 1) * productsPerPage;
  }

  private getLastPage = async (): Promise<number> => {
    if (!this.productCount) {
      const request = await getProducts();
      this.productCount = request?.total || 0;
    }
    return Math.ceil(this.productCount / productsPerPage);
  };

  private async goToPage(pageNumber: number): Promise<void> {
    const offset = this.calculateOffset(pageNumber);
    await this.catalog.filtersBlock.applyFilters(null, offset);
    this.pageNumberItem.textContent = pageNumber.toString();
    this.currentPage.set(pageNumber);
    this.toggleBtnsState(pageNumber);
  }

  private async toggleBtnsState(pageNumber: number): Promise<void> {
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
    if (pageNumber === 1) {
      makeInactive(firstPageButton, prevPageButton);
      makeActive(nextPageButton, lastPageButton);
    } else if (pageNumber === (await this.getLastPage())) {
      makeInactive(nextPageButton, lastPageButton);
      makeActive(firstPageButton, prevPageButton);
    } else {
      makeActive(firstPageButton, prevPageButton, nextPageButton, lastPageButton);
    }
  }
}

export { Pagination };
