/**
 * Utility to retrieve customized section settings from Shopify theme editor.
 * The liquid sections render their settings as JSON into script blocks with ID: shopify-settings-[sectionName]
 */
export const getShopifySettings = (sectionName, fallback) => {
  if (typeof window !== 'undefined') {
    const scriptEl = document.getElementById(`shopify-settings-${sectionName}`);
    if (scriptEl) {
      try {
        const parsed = JSON.parse(scriptEl.textContent);
        
        // Remove null/empty values to allow default values to persist
        const cleaned = {};
        Object.keys(parsed).forEach(key => {
          if (parsed[key] !== null && parsed[key] !== undefined && parsed[key] !== '') {
            cleaned[key] = parsed[key];
          }
        });
        
        return { ...fallback, ...cleaned };
      } catch (e) {
        console.error(`Error parsing settings for section ${sectionName}:`, e);
      }
    }
  }
  return fallback;
};
