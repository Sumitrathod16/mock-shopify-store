import React from 'react';
import chairImgLocal from '../assets/chair.png';
import { getAssetUrl } from '../utils/assets';
import { useShopifySettings } from '../utils/settings';

const chairImg = getAssetUrl('chair.png', chairImgLocal);

const defaultHeroSettings = {
  subtitle: 'New Autumn Collection 2026',
  title: 'Spaces Designed for Quiet Contemplation',
  description: 'A curated selection of minimalist living furniture, soft textiles, and organic ceramic art pieces designed to infuse harmony and space into your home.',
  buttonText: 'Explore Collection',
  secondaryButtonText: 'View Journal',
  image: null,
  productName: 'Aura Lounge Chair',
  productPrice: '$850.00 USD'
};

export default function Hero({ onExploreClick }) {
  const settings = useShopifySettings('hero', defaultHeroSettings);
  const heroImage = settings.image || chairImg;

  const renderTitle = () => {
    if (settings.title === defaultHeroSettings.title) {
      return (
        <>
          Spaces Designed <br />
          for Quiet <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Contemplation</span>
        </>
      );
    }
    return settings.title;
  };

  return (
    <section className="animate-fade-in" style={{
      padding: '40px 0 80px 0',
      backgroundColor: 'var(--bg-primary)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '60px',
        alignItems: 'center'
      }}>
        
        {/* Left Side text content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }} className="animate-slide-up">
          <span style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--accent)',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'block'
          }}>
            {settings.subtitle}
          </span>
          <h1 style={{
            fontSize: 'calc(2.5rem + 1.5vw)',
            lineHeight: '1.15',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '24px',
            fontFamily: 'var(--font-display)'
          }}>
            {renderTitle()}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            marginBottom: '40px',
            lineHeight: '1.7'
          }}>
            {settings.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={onExploreClick}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '0.05em',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              {settings.buttonText}
            </button>
            <button 
              onClick={onExploreClick}
              className="btn-secondary"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '0.05em',
                transition: 'var(--transition-smooth)'
              }}
            >
              {settings.secondaryButtonText}
            </button>
          </div>
        </div>

        {/* Right Side showcase image */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Background Organic Shape Decor */}
          <div style={{
            position: 'absolute',
            width: '85%',
            height: '85%',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '120px 40px 100px 40px',
            zIndex: 1,
            transition: 'var(--transition-smooth)'
          }} />

          {/* Featured Image */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            transform: 'rotate(-2deg)',
            transition: 'var(--transition-smooth)'
          }} className="hero-img-container">
            <img 
              src={heroImage} 
              alt={settings.productName} 
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="hero-img"
            />
          </div>

          {/* Floating glass info card */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '-10px',
            zIndex: 3,
            padding: '16px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
          }} className="glass floating-badge">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, display: 'block', letterSpacing: '0.1em' }}>
              Featured Product
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
              {settings.productName}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginTop: '1px' }}>
              {settings.productPrice}
            </span>
          </div>
        </div>

      </div>

      <style>{`
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
          background-color: var(--accent) !important;
        }
        .btn-secondary:hover {
          background-color: var(--bg-secondary);
          border-color: var(--text-primary);
        }
        .hero-img-container:hover {
          transform: rotate(0deg) scale(1.02) !important;
        }
        .hero-img-container:hover .hero-img {
          transform: scale(1.05);
        }
        .floating-badge {
          animation: floatAnimation 4s ease-in-out infinite;
        }
        @keyframes floatAnimation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @media (max-width: 992px) {
          section {
            padding: 40px 0 60px 0 !important;
          }
          .container {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
          }
          .hero-img-container {
            transform: rotate(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
