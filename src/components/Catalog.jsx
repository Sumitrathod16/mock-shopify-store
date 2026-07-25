import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useShopifySettings } from '../utils/settings';

const defaultCatalogSettings = {
  subtitle: 'Shop Aura',
  heading: 'All Collections'
};

export default function Catalog({ 
  products, 
  categories, 
  wishlistItems,
  onToggleWishlist,
  onQuickAdd, 
  onViewDetails, 
  searchQuery, 
  setSearchQuery 
}) {
  const settings = useShopifySettings('catalog', defaultCatalogSettings);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  // Auto-switch back to all category if wishlist is emptied
  useEffect(() => {
    if (selectedCategory === 'wishlist' && (!wishlistItems || wishlistItems.length === 0)) {
      setSelectedCategory('all');
    }
  }, [wishlistItems, selectedCategory]);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === 'all' || 
          (selectedCategory === 'wishlist' ? (wishlistItems && wishlistItems.includes(product.id)) : product.category === selectedCategory);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price <= priceRange;
        const matchesRating = product.rating >= minRating;
        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // 'featured' or default
      });
  }, [products, selectedCategory, searchQuery, priceRange, minRating, sortBy, wishlistItems]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(1000);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div id="catalog-section" style={{
      padding: '80px 0',
      backgroundColor: 'var(--bg-primary)',
      transition: 'var(--transition-smooth)',
      minHeight: '800px'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '24px'
        }}>
          <div>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', fontWeight: 600 }}>
              {settings.subtitle}
            </span>
            <h2 style={{ fontSize: '32px', marginTop: '6px', color: 'var(--text-primary)' }}>
              {selectedCategory === 'all' 
                ? settings.heading 
                : selectedCategory === 'wishlist' 
                  ? 'Saved Items' 
                  : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>

          {/* Catalog Controls */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`control-btn ${isFilterPanelOpen ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '50px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                transition: 'var(--transition-fast)'
              }}
            >
              <SlidersHorizontal size={14} /> 
              {isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '16px', pointerEvents: 'none', color: 'var(--text-secondary)', display: 'flex' }}>
                <ArrowUpDown size={14} />
              </span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '10px 16px 10px 38px',
                  borderRadius: '50px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '160px'
                }}
              >
                <option value="featured">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="category-tabs" style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                backgroundColor: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--bg-secondary)',
                color: selectedCategory === cat.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)'
              }}
              className="cat-pill"
            >
              {cat.name}
            </button>
          ))}
          {wishlistItems && wishlistItems.length > 0 && (
            <button
              key="wishlist"
              onClick={() => setSelectedCategory('wishlist')}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                backgroundColor: selectedCategory === 'wishlist' ? 'var(--accent)' : 'var(--bg-secondary)',
                color: selectedCategory === 'wishlist' ? '#FFFFFF' : 'var(--accent)',
                border: '1px solid',
                borderColor: selectedCategory === 'wishlist' ? 'var(--accent)' : 'var(--border)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              className="cat-pill-wishlist"
            >
              Saved Items ({wishlistItems.length})
            </button>
          )}
        </div>

        {/* Main Grid & Filters Column */}
        <div className={`catalog-layout-grid ${isFilterPanelOpen ? '' : 'filters-closed'}`}>
          {/* Filters Sidebar */}
          {isFilterPanelOpen && (
            <aside className="catalog-sidebar animate-fade-in">
              
              {/* Reset All */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Filter By
                </span>
                <button 
                  onClick={handleResetFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: 'var(--accent)',
                    fontWeight: 500
                  }}
                  className="reset-btn"
                >
                  <RefreshCw size={10} /> Reset
                </button>
              </div>

              {/* Price Filter */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  Max Price: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${priceRange}</span>
                </h4>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="25"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent)',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <span>$50</span>
                  <span>$1000</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  Minimum Rating
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[4.8, 4.6, 4.4, 0].map((ratingVal) => (
                    <label key={ratingVal} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === ratingVal}
                        onChange={() => setMinRating(ratingVal)}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <span>{ratingVal === 0 ? 'All Ratings' : `${ratingVal} ★ & Above`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Decorative note */}
              <div style={{
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                lineHeight: '1.5'
              }}>
                Free carbon-neutral shipping on orders over $500.
              </div>
            </aside>
          )}

          {/* Main Grid */}
          <main>
            {filteredProducts.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--card-shadow)'
              }} className="animate-fade-in">
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>☕</span>
                <h3 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>No Products Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '360px', fontSize: '14px' }}>
                  No objects matched your active search query or filter range. Try resetting filters to explore further.
                </p>
                <button 
                  onClick={handleResetFilters}
                  style={{
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    padding: '12px 28px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginTop: '24px',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="explore-btn"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '30px'
              }}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={wishlistItems ? wishlistItems.includes(product.id) : false}
                    onToggleWishlist={onToggleWishlist}
                    onQuickAdd={onQuickAdd}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

      </div>

      <style>{`
        .catalog-layout-grid {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 40px;
          align-items: start;
          transition: all 0.5s ease;
        }
        .catalog-layout-grid.filters-closed {
          grid-template-columns: 1fr;
        }
        .catalog-sidebar {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 24px;
          border-radius: 16px;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: var(--card-shadow);
          position: sticky;
          top: 100px;
        }
        .control-btn:hover {
          background-color: var(--bg-secondary);
          border-color: var(--text-primary) !important;
        }
        .control-btn.active {
          background-color: var(--text-primary) !important;
          color: var(--bg-primary) !important;
        }
        .cat-pill:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(0.95);
        }
        .reset-btn:hover {
          color: var(--text-primary) !important;
        }
        .explore-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 992px) {
          .catalog-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 30px;
          }
          .catalog-sidebar {
            position: relative !important;
            top: 0 !important;
            width: 100%;
            box-sizing: border-box;
          }
        }
        @media (max-width: 768px) {
          #catalog-section {
            padding: 40px 0 !important;
          }
          .category-tabs {
            margin-bottom: 20px !important;
          }
          select {
            min-width: 130px !important;
            font-size: 12px !important;
          }
          .control-btn {
            font-size: 12px !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
