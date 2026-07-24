import { products as mockProducts, categories as mockCategories } from '../mockData';

/**
 * Loads active products from the Shopify database.
 * If running in development or if the store has no products, it falls back to the design mockup products.
 */
export const getShopifyProducts = () => {
  if (typeof window !== 'undefined') {
    const scriptEl = document.getElementById('shopify-products-data');
    if (scriptEl) {
      try {
        const parsed = JSON.parse(scriptEl.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing Shopify products:', e);
      }
    }
  }
  return mockProducts;
};

/**
 * Dynamically builds categories based on the product types of products in the database.
 * Falls back to mock categories if Shopify products are not present.
 */
export const getShopifyCategories = (productsList) => {
  if (!productsList || productsList === mockProducts) {
    return mockCategories;
  }
  
  const types = new Set(
    productsList
      .map(p => p.category)
      .filter(category => typeof category === 'string' && category.trim() !== '')
  );
  
  const categories = [{ id: 'all', name: 'All Collection' }];
  types.forEach(type => {
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    categories.push({ id: type.toLowerCase(), name: capitalized });
  });
  
  return categories;
};
