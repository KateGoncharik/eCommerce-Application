import { CategoriesObject } from '@customTypes/catalog';
import { Category } from '@commercetools/platform-sdk';
import { el } from 'redom';
import lottie from 'lottie-web';
import loadIndicator from '@animation/load-indicator.json';

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

function createLoadAnimItem(className?: string): HTMLElement {
  const animItem = el(`.${className}`);

  lottie.loadAnimation({
    container: animItem,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadIndicator,
  });
  return animItem;
}

export { buildCategoriesObject, createLoadAnimItem };
