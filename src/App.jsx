import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { Sparkles, Mail, Send, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { getShopifyProducts, getShopifyCategories } from './utils/products';
import { useShopifySettings } from './utils/settings';

const loadedProducts = getShopifyProducts();
const loadedCategories = getShopifyCategories(loadedProducts);

const defaultValuePropsSettings = {
  prop1_title: "Free Carbon-Neutral Delivery",
  prop1_desc: "On all orders over $500. Packaged in recycled materials.",
  prop2_title: "30-Day Aesthetic Trial",
  prop2_desc: "Return any item if it doesn't fit your space perfectly.",
  prop3_title: "Architect Quality Guarantee",
  prop3_desc: "All products come with a certified 2-year warranty."
};

export default function App() {
  const valueProps = useShopifySettings('value-props', defaultValuePropsSettings);

  // 1. App states
  const [cartItems, setCartItems] = useState(() => {
    const local = localStorage.getItem('aura_cart');
    return local ? JSON.parse(local) : [];
  });
  
  const [theme, setTheme] = useState(() => {
    const local = localStorage.getItem('aura_theme');
    return local ? local : 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal visibility states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, discount: 0, shipping: 0, total: 0 });

  // Custom Toast Notification state
  const [toast, setToast] = useState({ show: false, message: '' });

  // 2. LocalStorage syncing
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Handlers
  const handleToggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleAddToCart = (product, quantity = 1, option = '') => {
    setCartItems((prevItems) => {
      // Find if item already exists with the same selected option
      const existingIdx = prevItems.findIndex(
        (item) => item.id === product.id && item.option === option
      );

      if (existingIdx > -1) {
        const newItems = [...prevItems];
        newItems[existingIdx].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity, option }];
      }
    });
    
    showToast(`Added ${quantity}x ${product.name} ${option ? `(${option})` : ''} to bag.`);
  };

  const handleQuickAdd = (product) => {
    // Quick Add gets default variant option (if options exist)
    let defaultOpt = '';
    if (product.options) {
      const keys = Object.keys(product.options);
      if (keys.length > 0) {
        defaultOpt = product.options[keys[0]][0];
      }
    }
    handleAddToCart(product, 1, defaultOpt);
  };

  const handleUpdateQty = (productId, option, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, option);
      return;
    }
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === productId && item.option === option 
          ? { ...item, quantity: newQty } 
          : item
      )
    );
  };

  const handleRemoveItem = (productId, option) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === productId && item.option === option))
    );
    showToast(`Item removed from bag.`);
  };

  const handleOpenProductDetails = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenCheckout = (totals) => {
    setCartTotals(totals);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    // Clear cart on checkout success
    setCartItems([]);
  };

  const scrollToCatalog = () => {
    const section = document.getElementById('catalog-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Promotion bar */}
      <div style={{
        backgroundColor: 'var(--text-primary)',
        color: 'var(--bg-primary)',
        textAlign: 'center',
        padding: '8px 20px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Sparkles size={12} style={{ color: 'var(--accent)' }} /> 
        Use code <span style={{ color: 'var(--accent)' }}>AURA10</span> for 10% off your first purchase
      </div>

      {/* Navigation */}
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={handleToggleTheme}
      />

      {/* Hero Header */}
      <Hero onExploreClick={scrollToCatalog} />

      {/* Store Value Props Bar */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '36px 0',
        backgroundColor: 'var(--bg-secondary)',
        transition: 'var(--transition-smooth)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Truck size={22} style={{ color: 'var(--accent)' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{valueProps.prop1_title}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{valueProps.prop1_desc}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={22} style={{ color: 'var(--accent)' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{valueProps.prop2_title}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{valueProps.prop2_desc}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} style={{ color: 'var(--accent)' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{valueProps.prop3_title}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{valueProps.prop3_desc}</p>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <Catalog 
        products={loadedProducts}
        categories={loadedCategories}
        onQuickAdd={handleQuickAdd}
        onViewDetails={handleOpenProductDetails}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '80px 0 40px 0',
        transition: 'var(--transition-smooth)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '50px',
          marginBottom: '60px'
        }}>
          {/* Logo Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '22px' }}>AURA</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Crafting calm. We believe the objects we surround ourselves with carry energy. Aura designs modern spaces centered around quiet contemplation and natural materials.
            </p>
            <div style={{ display: 'flex', gap: '14px', color: 'var(--text-secondary)' }}>
              <a href="#" className="social-icon" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Facebook" style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-primary)' }}>Collections</h4>
            {['Furniture', 'Lighting', 'Home Decor', 'Textiles', 'New Arrivals'].map(link => (
              <a key={link} href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)' }} className="footer-link-hover">{link}</a>
            ))}
          </div>

          {/* Links 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-primary)' }}>Customer Care</h4>
            {['Shipping Policy', 'Returns & Refunds', 'Sustainability', 'FAQ', 'Contact Support'].map(link => (
              <a key={link} href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)' }} className="footer-link-hover">{link}</a>
            ))}
          </div>

          {/* Newsletter signup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-primary)' }}>The Newsletter</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Subscribe to receive early catalog access and interior inspiration.</p>
            <form onSubmit={(e) => { e.preventDefault(); e.target.reset(); showToast('Subscribed! Check your inbox soon.'); }} style={{
              display: 'flex',
              borderBottom: '1px solid var(--text-primary)',
              paddingBottom: '8px'
            }}>
              <input 
                type="email" 
                placeholder="your.email@domain.com"
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  flexGrow: 1
                }}
              />
              <button type="submit" style={{ color: 'var(--text-primary)' }} aria-label="Subscribe">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="container" style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <span>© 2026 AURA Living Inc. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '16px' }}>
            <a href="#" className="footer-link-hover">Privacy</a>
            <a href="#" className="footer-link-hover">Terms of Service</a>
          </span>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          padding: '16px 28px',
          borderRadius: '12px',
          zIndex: 400,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <span>✨</span> {toast.message}
        </div>
      )}

      {/* Overlay Portals */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setSelectedProduct(null); }}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleOpenCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartTotals={cartTotals}
        onOrderComplete={handleOrderComplete}
      />

      <style>{`
        .social-icon:hover {
          color: var(--text-primary);
        }
        .footer-link-hover:hover {
          color: var(--text-primary) !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
