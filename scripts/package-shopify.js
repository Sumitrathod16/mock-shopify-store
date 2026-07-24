import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const shopifyThemeDir = path.join(rootDir, 'shopify-theme');
const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');

console.log('--- STARTING SHOPIFY THEME PACKAGING ---');

// 1. Ensure build output exists
if (!fs.existsSync(distDir)) {
  console.error('Error: "dist" directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// 2. Helper to create directory structure
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${path.relative(rootDir, dirPath)}`);
  }
};

createDir(shopifyThemeDir);
createDir(path.join(shopifyThemeDir, 'layout'));
createDir(path.join(shopifyThemeDir, 'templates'));
createDir(path.join(shopifyThemeDir, 'config'));
createDir(path.join(shopifyThemeDir, 'assets'));

// 3. Write layout/theme.liquid
const themeLiquidContent = `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="{{ canonical_url }}">
    
    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}

    <!-- Assets mapper for React SPA -->
    <script>
      window.ShopifyThemeAssets = {
        "chair.png": "{{ 'chair.png' | asset_url }}",
        "light.png": "{{ 'light.png' | asset_url }}"
      };
    </script>

    <!-- Main Stylesheet -->
    {{ 'theme.css' | asset_url | stylesheet_tag }}
  </head>
  <body>
    <div id="root">
      {{ content_for_layout }}
    </div>

    <!-- Main Bundle -->
    {{ 'theme.js' | asset_url | script_tag }}
  </body>
</html>
`;

fs.writeFileSync(path.join(shopifyThemeDir, 'layout', 'theme.liquid'), themeLiquidContent);
console.log('Wrote layout/theme.liquid');

// 4. Write templates/index.liquid
const indexLiquidContent = `{% comment %}
  The home page content is loaded dynamically by the React app inside the #root div.
  This template provides basic content in case JavaScript is disabled.
{% endcomment %}
<noscript>
  <div style="padding: 50px; text-align: center; font-family: sans-serif; color: #202020;">
    <h1>{{ shop.name }}</h1>
    <p>Please enable JavaScript to view our premium catalog.</p>
  </div>
</noscript>
`;

fs.writeFileSync(path.join(shopifyThemeDir, 'templates', 'index.liquid'), indexLiquidContent);
console.log('Wrote templates/index.liquid');

// 5. Write config/settings_schema.json
const settingsSchemaContent = [
  {
    "name": "theme_info",
    "theme_name": "AURA Minimalist Theme",
    "theme_version": "1.0.0",
    "theme_author": "AURA Team",
    "theme_documentation_url": "https://github.com",
    "theme_support_url": "https://github.com"
  }
];

fs.writeFileSync(
  path.join(shopifyThemeDir, 'config', 'settings_schema.json'), 
  JSON.stringify(settingsSchemaContent, null, 2)
);
console.log('Wrote config/settings_schema.json');

// 6. Write config/settings_data.json
const settingsDataContent = {
  "current": "Default",
  "presets": {
    "Default": {
      "sections": {}
    }
  }
};

fs.writeFileSync(
  path.join(shopifyThemeDir, 'config', 'settings_data.json'), 
  JSON.stringify(settingsDataContent, null, 2)
);
console.log('Wrote config/settings_data.json');

// 7. Process built React bundle from dist/assets
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  
  let jsCopied = false;
  let cssCopied = false;

  for (const file of files) {
    const filePath = path.join(distAssetsDir, file);
    
    // Check if it's the main JS bundle (starts with index or main and ends with .js, avoiding .js.map)
    if (file.endsWith('.js') && !file.endsWith('.map')) {
      fs.copyFileSync(filePath, path.join(shopifyThemeDir, 'assets', 'theme.js'));
      console.log(`Copied JS bundle: ${file} -> assets/theme.js`);
      jsCopied = true;
    }
    
    // Check if it's the main CSS bundle (starts with index or main and ends with .css, avoiding .css.map)
    if (file.endsWith('.css') && !file.endsWith('.map')) {
      fs.copyFileSync(filePath, path.join(shopifyThemeDir, 'assets', 'theme.css'));
      console.log(`Copied CSS bundle: ${file} -> assets/theme.css`);
      cssCopied = true;
    }
  }

  if (!jsCopied) console.warn('Warning: No JS bundle copied!');
  if (!cssCopied) console.warn('Warning: No CSS bundle copied!');
} else {
  console.error('Error: "dist/assets" directory not found. Compile project first.');
  process.exit(1);
}

// 8. Copy static assets to theme assets folder
const copyStaticAsset = (filename) => {
  const srcPath = path.join(rootDir, 'src', 'assets', filename);
  const destPath = path.join(shopifyThemeDir, 'assets', filename);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied static asset: ${filename} -> assets/${filename}`);
  } else {
    console.warn(`Warning: Static asset ${filename} not found at ${srcPath}`);
  }
};

copyStaticAsset('chair.png');
copyStaticAsset('light.png');

console.log('--- SHOPIFY THEME PACKAGED SUCCESSFULLY ---');
