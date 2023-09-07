import { CatalogPage } from '@app/pages/catalog/catalog-page';

type ProductMainData = {
  key: string;
  name: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  priceFull: string;
  priceDiscounted: string;
};

type CategoriesObject = {
  [key: string]: {
    key: string;
    name: string;
    subcategories: {
      id: string;
      key: string;
      name: string;
    }[];
  };
};

type CatalogPageType = CatalogPage;

export { ProductMainData, CategoriesObject, CatalogPageType };
