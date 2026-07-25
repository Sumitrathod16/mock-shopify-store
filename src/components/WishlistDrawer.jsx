import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  products, 
  onRemoveItem, 
  onAddToCart 
}) {
  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter products in wishlist
  const favoritedProducts = products.filter(p => wishlistItems.includes(p.id));

  const handleQuickAdd = (product) => {
    let defaultOpt = '';
    if (product.options) {
      const keys = Object.keys(product.options);
      if (keys.length > 0) {
        defaultOpt = product.options[keys[0]][0];
      }
    }
    onAddToCart(product, 1, defaultOpt);
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 250,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }}
    >
      {/* Drawer */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--card-bg)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px 30px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={18} fill="var(--accent)" style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Wishlist ({favoritedProducts.length})
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              padding: '6px', 
              color: 'var(--text-primary)',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              display: 'flex'
            }}
            className="close-drawer-btn"
            aria-label="Close wishlist"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '30px'
        }}>
          {favoritedProducts.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '40px', marginBottom: '16px' }}>🤍</span>
              <h4 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Your wishlist is empty</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '240px' }}>
                Save your favorite luxury minimalist designs here for later.
              </p>
              <button 
                onClick={onClose}
                style={{
                  marginTop: '24px',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '12px 28px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)'
                }}
                className="wishlist-shop-btn"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {favoritedProducts.map((item) => (
                <div 
                  key={item.id} 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '20px'
                  }}
                  className="wishlist-item-row"
                >
                  {/* Item Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      ${item.price.toFixed(2)}
                    </span>
                    
                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleQuickAdd(item)}
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        width: 'fit-content'
                      }}
                      className="wishlist-add-to-cart-btn"
                    >
                      <ShoppingBag size={12} /> Add to bag
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    style={{ 
                      padding: '8px', 
                      color: 'var(--text-secondary)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="trash-btn"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          .close-drawer-btn:hover {
            background-color: var(--text-primary);
            color: var(--bg-primary);
          }
          .wishlist-shop-btn:hover {
            background-color: var(--accent);
          }
          .wishlist-add-to-cart-btn:hover {
            text-decoration: underline;
            color: var(--text-primary);
          }
          .trash-btn:hover {
            color: #D26464 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
