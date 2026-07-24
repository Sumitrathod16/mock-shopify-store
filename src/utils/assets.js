/**
 * Utility to resolve static asset paths in the compiled Shopify theme environment.
 * In production (running on Shopify), asset URLs are dynamically determined by liquid filters 
 * and exposed in the window.ShopifyThemeAssets object.
 * In development, we fall back to standard local imports loaded via Vite.
 */
export const getAssetUrl = (filename, localFallback) => {
  if (typeof window !== 'undefined' && window.ShopifyThemeAssets && window.ShopifyThemeAssets[filename]) {
    return window.ShopifyThemeAssets[filename];
  }
  return localFallback;
};
