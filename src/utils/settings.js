import { useState, useEffect } from 'react';

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

/**
 * React hook to retrieve settings dynamically and re-render the component
 * when settings change in the Shopify Customizer.
 */
export const useShopifySettings = (sectionName, fallback) => {
  const [settings, setSettings] = useState(() => getShopifySettings(sectionName, fallback));

  useEffect(() => {
    let timeoutId = null;

    const handleSectionLoad = (event) => {
      // Re-read settings when any section is loaded/reloaded in the Theme Editor.
      // Shopify re-renders sections dynamically, so we wait 50ms for the DOM updates to settle.
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSettings(getShopifySettings(sectionName, fallback));
      }, 50);
    };

    document.addEventListener('shopify:section:load', handleSectionLoad);
    document.addEventListener('shopify:section:select', handleSectionLoad);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('shopify:section:load', handleSectionLoad);
      document.removeEventListener('shopify:section:select', handleSectionLoad);
    };
  }, [sectionName, fallback]);

  return settings;
};
