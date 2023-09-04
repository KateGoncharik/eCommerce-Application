import { ProductMainData, CategoriesObject } from '@customTypes/catalog';
import { ProductProjection, Category } from '@commercetools/platform-sdk';

async function extractProductData(productProjections: Promise<ProductProjection[]>): Promise<ProductMainData[]> {
  const products = await productProjections;
  const productData: ProductMainData[] = products.map((product) => {
    const price = product.masterVariant.prices?.[0];
    const priceDiscounted = price?.discounted;
    const description = product.description?.['en-US'] || '';
    const getPriceInUsd = (price: number | undefined): string => `$${(Number(price) / 100).toFixed(2)}`;

    return {
      key: product.key || '',
      name: product.name['en-US'],
      shortDescription: description.slice(0, 125) + '...',
      longDescription: description.slice(0, 300) + '...',
      image: product.masterVariant.images?.[0].url || '',
      priceFull: getPriceInUsd(price?.value.centAmount),
      priceDiscounted: priceDiscounted ? getPriceInUsd(priceDiscounted.value.centAmount) : '',
    };
  });
  return productData;
}

async function buildCategoriesObject(categoriesArray: Promise<Category[]>): Promise<CategoriesObject> {
  const categories = await categoriesArray;
  const categoriesObject: CategoriesObject = {};
  const subcategories: Category[] = [];

  categories.forEach((category) => {
    const categoryName = category.name['en-US'];
    if (!category.ancestors.length) {
      categoriesObject[category.id] = { key: category.key || '', name: categoryName, subcategories: [] };
    } else {
      subcategories.push(category);
    }
  });
  subcategories.forEach((subcategory) => {
    const parentCategory = subcategory.ancestors[0];
    const subcategoryData = { id: subcategory.id, key: subcategory.key || '', name: subcategory.name['en-US'] };
    categoriesObject[parentCategory.id].subcategories.push(subcategoryData);
  });
  return categoriesObject;
}

export { extractProductData, buildCategoriesObject };
