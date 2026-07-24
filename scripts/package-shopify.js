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
createDir(path.join(shopifyThemeDir, 'sections'));
createDir(path.join(shopifyThemeDir, 'config'));
createDir(path.join(shopifyThemeDir, 'assets'));

// Clean up obsolete index.liquid file if present
const obsoleteIndexLiquid = path.join(shopifyThemeDir, 'templates', 'index.liquid');
if (fs.existsSync(obsoleteIndexLiquid)) {
  fs.unlinkSync(obsoleteIndexLiquid);
  console.log('Deleted obsolete templates/index.liquid (replaced by templates/index.json)');
}

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

// 4. Write templates/index.json (OS 2.0 Template)
const indexJsonContent = {
  "sections": {
    "hero": {
      "type": "hero",
      "settings": {}
    },
    "value_props": {
      "type": "value-props",
      "settings": {}
    },
    "catalog": {
      "type": "catalog",
      "settings": {}
    }
  },
  "order": [
    "hero",
    "value_props",
    "catalog"
  ]
};

fs.writeFileSync(
  path.join(shopifyThemeDir, 'templates', 'index.json'), 
  JSON.stringify(indexJsonContent, null, 2)
);
console.log('Wrote templates/index.json');

// 5. Write sections/hero.liquid
const heroLiquidContent = `<script type="application/json" id="shopify-settings-hero">
  {
    "subtitle": {{ section.settings.subtitle | json }},
    "title": {{ section.settings.title | json }},
    "description": {{ section.settings.description | json }},
    "buttonText": {{ section.settings.button_text | json }},
    "secondaryButtonText": {{ section.settings.secondary_button_text | json }},
    "productName": {{ section.settings.product_name | json }},
    "productPrice": {{ section.settings.product_price | json }},
    "image": {% if section.settings.image != blank %}{{ section.settings.image | img_url: '1000x' | json }}{% else %}null{% endif %}
  }
</script>

{% schema %}
{
  "name": "Hero Showcase",
  "settings": [
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "New Autumn Collection 2026"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Heading",
      "default": "Spaces Designed for Quiet Contemplation"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "A curated selection of minimalist living furniture, soft textiles, and organic ceramic art pieces designed to infuse harmony and space into your home."
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Primary Button Text",
      "default": "Explore Collection"
    },
    {
      "type": "text",
      "id": "secondary_button_text",
      "label": "Secondary Button Text",
      "default": "View Journal"
    },
    {
      "type": "header",
      "content": "Floating Product Card"
    },
    {
      "type": "text",
      "id": "product_name",
      "label": "Product Name",
      "default": "Aura Lounge Chair"
    },
    {
      "type": "text",
      "id": "product_price",
      "label": "Product Price",
      "default": "$850.00 USD"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Hero Image (Overrides default chair)"
    }
  ],
  "presets": [
    {
      "name": "Hero Showcase"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(shopifyThemeDir, 'sections', 'hero.liquid'), heroLiquidContent);
console.log('Wrote sections/hero.liquid');

// 6. Write sections/value-props.liquid
const valuePropsLiquidContent = `<script type="application/json" id="shopify-settings-value-props">
  {
    "prop1_title": {{ section.settings.prop1_title | json }},
    "prop1_desc": {{ section.settings.prop1_desc | json }},
    "prop2_title": {{ section.settings.prop2_title | json }},
    "prop2_desc": {{ section.settings.prop2_desc | json }},
    "prop3_title": {{ section.settings.prop3_title | json }},
    "prop3_desc": {{ section.settings.prop3_desc | json }}
  }
</script>

{% schema %}
{
  "name": "Store Value Propositions",
  "settings": [
    {
      "type": "header",
      "content": "Proposition 1"
    },
    {
      "type": "text",
      "id": "prop1_title",
      "label": "Title",
      "default": "Free Carbon-Neutral Delivery"
    },
    {
      "type": "text",
      "id": "prop1_desc",
      "label": "Description",
      "default": "On all orders over $500. Packaged in recycled materials."
    },
    {
      "type": "header",
      "content": "Proposition 2"
    },
    {
      "type": "text",
      "id": "prop2_title",
      "label": "Title",
      "default": "30-Day Aesthetic Trial"
    },
    {
      "type": "text",
      "id": "prop2_desc",
      "label": "Description",
      "default": "Return any item if it doesn't fit your space perfectly."
    },
    {
      "type": "header",
      "content": "Proposition 3"
    },
    {
      "type": "text",
      "id": "prop3_title",
      "label": "Title",
      "default": "Architect Quality Guarantee"
    },
    {
      "type": "text",
      "id": "prop3_desc",
      "label": "Description",
      "default": "All products come with a certified 2-year warranty."
    }
  ],
  "presets": [
    {
      "name": "Store Value Propositions"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(shopifyThemeDir, 'sections', 'value-props.liquid'), valuePropsLiquidContent);
console.log('Wrote sections/value-props.liquid');

// 7. Write sections/catalog.liquid
const catalogLiquidContent = `<script type="application/json" id="shopify-settings-catalog">
  {
    "subtitle": {{ section.settings.subtitle | json }},
    "heading": {{ section.settings.heading | json }}
  }
</script>

<script type="application/json" id="shopify-products-data">
  [
    {% paginate collections.all.products by 50 %}
      {% for product in collections.all.products %}
        {
          "id": {{ product.id }},
          "name": {{ product.title | json }},
          "category": {{ product.type | json | default: "decor" }},
          "price": {{ product.price | money_without_currency | replace: ',', '' }},
          "rating": 5.0,
          "reviews": 0,
          "image": {% if product.featured_image != blank %}{{ product.featured_image | img_url: '800x800' | json }}{% else %}null{% endif %},
          "description": {{ product.description | strip_html | truncatewords: 50 | json }},
          "specs": {
            "Vendor": {{ product.vendor | json }},
            "Type": {{ product.type | json }}
          },
          "options": {
            {% for option in product.options_with_values %}
              {{ option.name | downcase | json }}: [
                {% for value in option.values %}
                  {{ value | json }}{% unless forloop.last %},{% endunless %}
                {% endfor %}
              ]{% unless forloop.last %},{% endunless %}
            {% endfor %}
          }
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    {% endpaginate %}
  ]
</script>

{% schema %}
{
  "name": "Product Catalog",
  "settings": [
    {
      "type": "text",
      "id": "subtitle",
      "label": "Catalog Subtitle",
      "default": "Shop Aura"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Catalog Heading",
      "default": "All Collections"
    }
  ],
  "presets": [
    {
      "name": "Product Catalog"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(shopifyThemeDir, 'sections', 'catalog.liquid'), catalogLiquidContent);
console.log('Wrote sections/catalog.liquid');

// 8. Write config/settings_schema.json
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

// 9. Write config/settings_data.json
const settingsDataContent = {
  "current": "Default",
  "presets": {
    "Default": {
      "sections": {
        "hero": {
          "type": "hero",
          "settings": {}
        },
        "value_props": {
          "type": "value-props",
          "settings": {}
        },
        "catalog": {
          "type": "catalog",
          "settings": {}
        }
      }
    }
  }
};

fs.writeFileSync(
  path.join(shopifyThemeDir, 'config', 'settings_data.json'), 
  JSON.stringify(settingsDataContent, null, 2)
);
console.log('Wrote config/settings_data.json');

// 10. Process built React bundle from dist/assets
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

// 11. Copy static assets to theme assets folder
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
