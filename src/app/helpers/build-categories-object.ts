import { CategoriesObject } from '@customTypes/catalog';
import { Category } from '@commercetools/platform-sdk';

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

export { buildCategoriesObject };
