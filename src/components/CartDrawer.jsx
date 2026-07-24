import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Ticket } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onCheckout 
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
  const [discountError, setDiscountError] = useState('');
  const [discountAppliedMsg, setDiscountAppliedMsg] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const freeShippingThreshold = 500;
  const shippingCost = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 35;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AURA10') {
      setAppliedDiscount(10);
      setDiscountAppliedMsg('Promo code AURA10 (10% off) applied!');
      setDiscountError('');
    } else {
      setDiscountError('Invalid code. Try "AURA10"');
      setDiscountAppliedMsg('');
    }
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
            <ShoppingBag size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your Bag ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
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
            aria-label="Close cart"
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
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '40px', marginBottom: '16px' }}>🛍️</span>
              <h4 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Your bag is empty</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '240px' }}>
                Add some exquisite items to your bag to make your home feel alive.
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
                className="cart-shop-btn"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.option}`} 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '20px'
                  }}
                  className="cart-item-row"
                >
                  {/* Item Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.name}
                    </h4>
                    {item.option && (
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Variant: {item.option}
                      </span>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border)',
                      borderRadius: '50px',
                      padding: '2px 8px',
                      backgroundColor: 'var(--bg-primary)',
                      width: 'fit-content',
                      marginTop: '6px'
                    }}>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.option, item.quantity - 1)}
                        style={{ padding: '4px', color: 'var(--text-secondary)' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.option, item.quantity + 1)}
                        style={{ padding: '4px', color: 'var(--text-secondary)' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemoveItem(item.id, item.option)}
                    style={{
                      padding: '8px',
                      color: 'var(--text-secondary)',
                      borderRadius: '50%',
                      transition: 'var(--transition-fast)'
                    }}
                    className="trash-btn"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Pricing & Checkout) */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px 30px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Promo code field */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                border: '1px solid var(--border)',
                borderRadius: '50px',
                padding: '8px 16px',
                backgroundColor: 'var(--bg-primary)',
                gap: '8px'
              }}>
                <Ticket size={14} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Promo: AURA10" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    width: '100%'
                  }}
                />
              </div>
              <button 
                onClick={handleApplyPromo}
                style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
                className="promo-btn"
              >
                Apply
              </button>
            </div>
            {discountError && <span style={{ fontSize: '11px', color: '#D26464', display: 'block', paddingLeft: '8px' }}>{discountError}</span>}
            {discountAppliedMsg && <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, display: 'block', paddingLeft: '8px' }}>{discountAppliedMsg}</span>}

            {/* Calculations lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)' }}>
                  <span>Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {shippingCost > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '-4px' }}>
                  Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping.
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '16px', 
                fontWeight: 700, 
                borderTop: '1px solid var(--border)', 
                paddingTop: '12px', 
                color: 'var(--text-primary)' 
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => {
                onCheckout({
                  subtotal,
                  discount: discountAmount,
                  shipping: shippingCost,
                  total
                });
              }}
              style={{
                width: '100%',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                padding: '16px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'center',
                letterSpacing: '0.05em',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <style>{`
        .close-drawer-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
        }
        .cart-shop-btn:hover {
          background-color: var(--accent) !important;
        }
        .trash-btn:hover {
          color: #D26464 !important;
          background-color: rgba(210, 100, 100, 0.05);
        }
        .promo-btn:hover {
          background-color: var(--accent) !important;
        }
        .checkout-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
