import React, { useState } from 'react';
import { ShoppingBag, Search, Moon, Sun, Menu, X } from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onCartClick, 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme 
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="glass sticky-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
        position: 'relative'
      }}>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          style={{ display: 'none', color: 'var(--text-primary)' }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Logo */}
        <a href="#" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center'
        }}>
          AURA
        </a>

        {/* Links - Center */}
        <div className="nav-links" style={{
          display: 'flex',
          gap: '32px',
        }}>
          {['Shop', 'About', 'Journal', 'Support'].map((link) => (
            <a 
              key={link} 
              href="#" 
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                transition: 'var(--transition-fast)',
                position: 'relative'
              }}
              className="nav-hover"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Action Controls - Right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Search Expanding Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: isSearchOpen ? 'var(--bg-secondary)' : 'transparent',
            borderRadius: '20px',
            padding: isSearchOpen ? '6px 12px' : '0',
            transition: 'var(--transition-smooth)',
            border: isSearchOpen ? '1px solid var(--border)' : '1px solid transparent'
          }}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <input 
              type="text" 
              placeholder="Search collections..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: isSearchOpen ? '180px' : '0px',
                opacity: isSearchOpen ? 1 : 0,
                paddingLeft: isSearchOpen ? '8px' : '0',
                fontSize: '13px',
                outline: 'none',
                transition: 'var(--transition-smooth)',
                background: 'transparent',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            style={{ 
              color: 'var(--text-primary)', 
              display: 'flex', 
              alignItems: 'center',
              padding: '6px',
              borderRadius: '50%',
              transition: 'var(--transition-fast)'
            }}
            className="icon-btn-hover"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Shopping Cart Icon & Badge */}
          <button 
            onClick={onCartClick} 
            style={{ 
              color: 'var(--text-primary)', 
              display: 'flex', 
              alignItems: 'center',
              position: 'relative',
              padding: '6px',
              borderRadius: '50%',
              transition: 'var(--transition-fast)'
            }}
            className="icon-btn-hover"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="badge animate-pop" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* CSS Injection for custom interactions */}
      <style>{`
        .mobile-toggle {
          padding: 8px;
          border-radius: 4px;
        }
        .nav-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: var(--text-primary);
          transition: var(--transition-fast);
        }
        .nav-hover:hover::after {
          width: 100%;
        }
        .nav-hover:hover {
          color: var(--text-primary) !important;
        }
        .icon-btn-hover:hover {
          background-color: var(--bg-secondary);
        }
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
          }
          .nav-links {
            display: ${isMobileMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background-color: var(--bg-primary);
            border-bottom: 1px solid var(--border);
            padding: 20px 40px;
            gap: 20px !important;
            box-shadow: 0 10px 15px rgba(0,0,0,0.05);
          }
        }
      `}</style>
    </nav>
  );
}
