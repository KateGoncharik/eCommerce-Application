import { ProductMainData } from '@customTypes/products';
import { ProductProjection } from '@commercetools/platform-sdk';

async function extractProductData(productProjections: Promise<ProductProjection[]>): Promise<ProductMainData[]> {
  const products = await productProjections;
  const productData: ProductMainData[] = products.map((product) => {
    const price = product.masterVariant.prices?.[0];
    const priceDiscounted = price?.discounted;
    const description = product.description?.['en-US'] || '';
    const getPriceInUsd = (price: number | undefined): string => `$${(Number(price) / 100).toFixed(2)}`;

    return {
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

export { extractProductData };
