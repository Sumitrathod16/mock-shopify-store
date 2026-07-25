import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRightLeft, Heart } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onAddToCart, wishlistItems, onToggleWishlist }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isWishlisted = wishlistItems && product ? wishlistItems.includes(product.id) : false;
  const productImages = product && product.images ? product.images : (product ? [product.image] : []);

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

  // Reset local state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveImageIdx(0);
      if (product.options) {
        const keys = Object.keys(product.options);
        if (keys.length > 0) {
          setSelectedOption(product.options[keys[0]][0]);
        }
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedOption);
    onClose();
  };

  const optionName = product.options ? Object.keys(product.options)[0] : '';
  const optionValues = product.options && optionName ? product.options[optionName] : [];

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
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }}
    >
      {/* Modal Box */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          animation: 'scaleIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 10,
            padding: '8px',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)'
          }}
          className="close-btn"
          aria-label="Close details"
        >
          <X size={16} />
        </button>

        {/* Left Side: Product Media Showcase */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px'
        }}>
          <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={productImages[activeImageIdx]} 
              alt={product.name} 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                transition: 'var(--transition-smooth)'
              }}
            />
            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(idx => (idx === 0 ? productImages.length - 1 : idx - 1))}
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    zIndex: 15,
                    fontSize: '16px',
                    lineHeight: 1
                  }}
                  className="carousel-arrow"
                  aria-label="Previous image"
                >
                  &larr;
                </button>
                <button
                  onClick={() => setActiveImageIdx(idx => (idx === productImages.length - 1 ? 0 : idx + 1))}
                  style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    zIndex: 15,
                    fontSize: '16px',
                    lineHeight: 1
                  }}
                  className="carousel-arrow"
                  aria-label="Next image"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>
          
          {productImages.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', zIndex: 10 }}>
              {productImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: activeImageIdx === i ? 'var(--text-primary)' : 'var(--border)',
                    padding: 0,
                    transition: 'var(--transition-fast)'
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Form */}
        <div style={{
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '24px'
        }}>
          {/* Header */}
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', fontWeight: 600 }}>
              {product.category} collection
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {product.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <div style={{ display: 'flex', color: '#E5C396' }}>
                <Star size={14} fill="#E5C396" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                ({product.reviews} verified reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div style={{
            fontSize: '26px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)'
          }}>
            ${(product.price * quantity).toFixed(2)} USD
          </div>

          {/* Description */}
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {product.description}
          </p>

          {/* Dynamic Variant Selectors */}
          {optionValues.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                Select {optionName}: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{selectedOption}</span>
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {optionValues.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedOption(val)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: 500,
                      backgroundColor: selectedOption === val ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: selectedOption === val ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid',
                      borderColor: selectedOption === val ? 'var(--text-primary)' : 'var(--border)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="variant-pill"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)'
          }}>
            
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              borderRadius: '50px',
              padding: '4px 10px',
              backgroundColor: 'var(--bg-primary)'
            }}>
              <button 
                onClick={handleDecrement}
                style={{ padding: '8px', color: 'var(--text-secondary)' }}
                className="q-btn"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                style={{ padding: '8px', color: 'var(--text-secondary)' }}
                className="q-btn"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAdd}
              style={{
                flexGrow: 1,
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                padding: '16px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                letterSpacing: '0.05em',
                transition: 'var(--transition-smooth)'
              }}
              className="modal-add-btn"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: isWishlisted ? 'var(--accent)' : 'var(--text-primary)',
                padding: '16px',
                borderRadius: '50px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              className="modal-wishlist-btn"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} fill={isWishlisted ? "var(--accent)" : "none"} />
            </button>
          </div>

          {/* Specifications Panel */}
          <div style={{
            marginTop: '12px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
              Product Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '13px' }}>
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{key}</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            paddingTop: '8px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} /> 2-Year Warranty
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowRightLeft size={14} style={{ color: 'var(--accent)' }} /> 30-Day Free Returns
            </span>
          </div>

        </div>
      </div>

      <style>{`
        .close-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
          transform: scale(1.05);
        }
        .variant-pill:hover {
          border-color: var(--text-primary);
        }
        .q-btn:hover {
          color: var(--text-primary) !important;
        }
        .modal-add-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .modal-wishlist-btn:hover {
          background-color: var(--bg-secondary) !important;
          border-color: var(--text-primary) !important;
          transform: translateY(-1px);
        }
        .carousel-arrow:hover {
          background-color: var(--text-primary) !important;
          color: var(--bg-primary) !important;
          transform: translateY(-50%) scale(1.05) !important;
        }
        @media (max-width: 860px) {
          div[class*="animate-scale-in"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="padding: 48px 40px"] {
            padding: 30px 24px !important;
          }
          div[style*="padding: 40px"] {
            padding: 20px !important;
            min-height: 280px !important;
          }
        }
      `}</style>
    </div>
  );
}
