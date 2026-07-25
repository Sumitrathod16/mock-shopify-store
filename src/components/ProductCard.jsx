import React from 'react';
import { Plus, Star, Heart } from 'lucide-react';

export default function ProductCard({ product, isWishlisted, onToggleWishlist, onQuickAdd, onViewDetails }) {
  return (
    <div className="product-card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: 'var(--card-bg)',
      boxShadow: 'var(--card-shadow)',
      border: '1px solid var(--border)',
      transition: 'var(--transition-smooth)'
    }}>
      
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'var(--bg-secondary)',
      }} onClick={() => onViewDetails(product)}>
        
        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="wishlist-toggle-card-btn"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            backgroundColor: 'var(--bg-primary)',
            color: isWishlisted ? 'var(--accent)' : 'var(--text-secondary)',
            padding: '8px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'var(--transition-smooth)'
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} fill={isWishlisted ? "var(--accent)" : "none"} />
        </button>

        {/* Category Tag */}
        <span style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-secondary)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: '50px',
          border: '1px solid var(--border)',
          pointerEvents: 'none'
        }}>
          {product.category}
        </span>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
          className="product-card-img"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className="hover-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.03)',
          opacity: 0,
          transition: 'var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }} />

        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(product);
          }}
          className="quick-add-btn"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%) translateY(10px)',
            opacity: 0,
            zIndex: 10,
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '50px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <Plus size={14} /> Quick Add
        </button>
      </div>

      {/* Info details */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexGrow: 1
      }}>
        {/* Rating Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', color: '#E5C396' }}>
            <Star size={12} fill="#E5C396" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {product.rating}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'var(--transition-fast)'
          }}
          className="card-title-hover"
        >
          {product.name}
        </h3>

        {/* Price Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          <span style={{
            fontSize: '17px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>
            ${product.price.toFixed(2)}
          </span>
          
          <button 
            onClick={() => onViewDetails(product)}
            style={{
              fontSize: '12px',
              color: 'var(--accent)',
              fontWeight: 500,
              borderBottom: '1px solid transparent',
              transition: 'var(--transition-fast)',
              paddingBottom: '2px'
            }}
            className="details-link-hover"
          >
            Details →
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
          border-color: rgba(184, 146, 96, 0.2);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.04);
        }
        .product-card:hover .hover-overlay {
          opacity: 1;
        }
        .product-card:hover .quick-add-btn {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .quick-add-btn:hover {
          background-color: var(--accent) !important;
          transform: translateX(-50%) translateY(-2px) scale(1.02) !important;
        }
        .card-title-hover:hover {
          color: var(--accent) !important;
        }
        .details-link-hover:hover {
          border-color: var(--accent);
          transform: translateX(2px);
        }
        .wishlist-toggle-card-btn:hover {
          transform: scale(1.1) !important;
          color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
}
