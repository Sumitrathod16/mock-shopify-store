import chairImgLocal from './assets/chair.png';
import lightImgLocal from './assets/light.png';
import { getAssetUrl } from './utils/assets';

const chairImg = getAssetUrl('chair.png', chairImgLocal);
const lightImg = getAssetUrl('light.png', lightImgLocal);

export const categories = [
  { id: 'all', name: 'All Collection' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'decor', name: 'Home Decor' },
  { id: 'textiles', name: 'Textiles' }
];

export const products = [
  {
    id: 1,
    name: "Aura Lounge Chair",
    category: "furniture",
    price: 850,
    rating: 4.9,
    reviews: 124,
    image: chairImg,
    description: "Indulge in organic minimalism. Crafted with a premium textured boucle fabric and set upon warm oak legs, the Aura Lounge Chair provides absolute comfort without sacrificing a single line of aesthetic purity. Designed to be the centerpiece of any modern living space.",
    specs: {
      Dimensions: "32\" W x 34\" D x 30\" H",
      Material: "Boucle Fabric, Solid White Oak",
      Weight: "42 lbs",
      Color: "Cream Boucle"
    },
    options: {
      color: ["Warm Cream", "Slate Gray", "Oatmeal"]
    }
  },
  {
    id: 2,
    name: "Eclipse Pendant Light",
    category: "lighting",
    price: 320,
    rating: 4.8,
    reviews: 86,
    image: lightImg,
    description: "Casting a warm, celestial glow, the Eclipse Pendant features a hand-blown frosted glass sphere balanced elegantly by a hand-finished matte brass fixture. An iconic lighting solution that elevates dining areas, entryways, or bedrooms.",
    specs: {
      Diameter: "12 inches",
      Material: "Frosted Glass, Brass-plated Steel",
      Cord: "8 ft adjustable fabric cord",
      Bulb: "LED G9 base, dimmable (included)"
    },
    options: {
      finish: ["Matte Brass", "Brushed Nickel", "Anodized Black"]
    }
  },
  {
    id: 3,
    name: "Zenith Ceramic Vases (Trio)",
    category: "decor",
    price: 145,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
    description: "A harmonious family of three ceramic vases featuring varying heights and matching organic, asymmetrical shapes. Made from hand-thrown clay and finished with a unique matte, sandy texture, they stand as sculpture alone or dressed with minimal dry botanicals.",
    specs: {
      Sizes: "Small: 5\" | Medium: 8\" | Large: 11\" height",
      Material: "Stoneware clay, raw mineral wash",
      Finish: "Matte textured sand",
      Origin: "Handmade in Denmark"
    },
    options: {
      finish: ["Textured Sand", "Terracotta Matte", "Charcoal Black"]
    }
  },
  {
    id: 4,
    name: "Solstice Brass Sconce",
    category: "lighting",
    price: 195,
    rating: 4.6,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "A sleek, linear LED wall light designed to cast indirect warmth. Solstice combines brushed copper or brass fixtures with a modern diffusing tube. It is a stunning architectural piece for hallways, bedrooms, or dining backdrops.",
    specs: {
      Length: "24 inches",
      Material: "Solid Brass, Acrylic Diffuser",
      Output: "12W warm white light (2700K)",
      Installation: "Hardwired, backplate fits standard box"
    },
    options: {
      metal: ["Brushed Brass", "Oxidized Copper", "Satin Silver"]
    }
  },
  {
    id: 5,
    name: "Terrace Oak Coffee Table",
    category: "furniture",
    price: 680,
    rating: 4.9,
    reviews: 43,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80",
    description: "The Terrace Oak Coffee Table features a robust, low-slung profile supported by chunky cylindrical legs. Highlighting the natural grain of premium white oak, this table introduces a commanding yet calm presence to your living room seating setup.",
    specs: {
      Dimensions: "42\" Diameter x 14\" Height",
      Material: "Solid White Oak, FSC Certified",
      Finish: "Water-based matte sealant",
      Weight: "58 lbs"
    },
    options: {
      wood: ["Natural Oak", "Smoked Oak", "Ebonized Ash"]
    }
  },
  {
    id: 6,
    name: "Haze Merino Wool Blanket",
    category: "textiles",
    price: 180,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&auto=format&fit=crop&q=80",
    description: "Woven in a historic mill in Italy, the Haze blanket is made of 100% fine Merino wool. Extremely soft, lightweight, yet exceptionally warm. Features a delicate duo-tone melange pattern and minimal eyelash fringe.",
    specs: {
      Dimensions: "55\" x 70\"",
      Material: "100% Merino Wool",
      Care: "Dry clean or delicate hand wash",
      Weight: "1.2 lbs"
    },
    options: {
      pattern: ["Cream & Gray Melange", "Oat & Sand", "Slate & Olive"]
    }
  },
  {
    id: 7,
    name: "Organic Waffle Cushion Set",
    category: "textiles",
    price: 85,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
    description: "A pair of decorative throw cushions in structured waffle-weave organic cotton. Includes premium hypoallergenic feather inserts for an elevated look and cloud-like support. Invisible zipper closure along the bottom edge.",
    specs: {
      Dimensions: "20\" x 20\" (set of 2)",
      Material: "100% Organic Cotton cover, Feather insert",
      Certification: "GOTS Certified cotton",
      Care: "Machine washable cover"
    },
    options: {
      color: ["Natural Flax", "Stone Gray", "Clay Orange"]
    }
  },
  {
    id: 8,
    name: "Sleek Brass Silent Wall Clock",
    category: "decor",
    price: 110,
    rating: 4.7,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80",
    description: "A premium silent sweep wall clock. Encased in a slim brass-brushed frame, this clock features simple line hands without numbers, reflecting a pure appreciation for minimal timekeeping. Uses a high-grade silent quartz movement.",
    specs: {
      Diameter: "11.8 inches",
      Depth: "1.5 inches",
      Material: "Brushed Aluminum casing, Glass face",
      Battery: "1 AA Battery required (not included)"
    },
    options: {
      case: ["Brushed Brass", "Satin Black", "Silver Chrome"]
    }
  }
];
