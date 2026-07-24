import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartTotals, onOrderComplete }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingForm, setShippingForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', zip: '', country: 'United States'
  });
  const [paymentForm, setPaymentForm] = useState({
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!shippingForm.email) errors.email = 'Email required';
    if (!shippingForm.firstName) errors.firstName = 'First name required';
    if (!shippingForm.lastName) errors.lastName = 'Last name required';
    if (!shippingForm.address) errors.address = 'Address required';
    if (!shippingForm.city) errors.city = 'City required';
    if (!shippingForm.zip) errors.zip = 'ZIP required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!paymentForm.cardName) errors.cardName = 'Name on card required';
    if (!paymentForm.cardNumber || paymentForm.cardNumber.length < 16) errors.cardNumber = 'Valid 16-digit card required';
    if (!paymentForm.cardExpiry) errors.cardExpiry = 'Expiry required';
    if (!paymentForm.cardCvv || paymentForm.cardCvv.length < 3) errors.cardCvv = 'CVV required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setStep(3);
      onOrderComplete();
    }
  };

  // Auto-format card number as typed
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    setPaymentForm({ ...paymentForm, cardNumber: value });
  };

  // Auto-format expiry date MM/YY as typed
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setPaymentForm({ ...paymentForm, cardExpiry: formatted.substring(0, 5) });
  };

  const orderNumber = "AURA-" + Math.floor(10000000 + Math.random() * 90000000);

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
        zIndex: 300,
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
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
          position: 'relative',
          padding: '40px 50px'
        }}
      >
        {/* Close Button */}
        {step !== 3 && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              padding: '8px',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              display: 'flex'
            }}
            className="checkout-close-btn"
          >
            <X size={16} />
          </button>
        )}

        {/* Wizard Steps Breadcrumbs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: step >= 1 ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: step >= 1 ? 'var(--text-primary)' : 'var(--border)', 
              color: 'var(--bg-primary)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '11px'
            }}>1</span> Shipping
          </span>
          <ChevronRight size={14} style={{ color: 'var(--border)' }} />
          <span style={{ color: step >= 2 ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: step >= 2 ? 'var(--text-primary)' : 'var(--border)', 
              color: 'var(--bg-primary)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '11px'
            }}>2</span> Payment
          </span>
          <ChevronRight size={14} style={{ color: 'var(--border)' }} />
          <span style={{ color: step === 3 ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: step === 3 ? 'var(--accent)' : 'var(--border)', 
              color: 'var(--bg-primary)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '11px'
            }}>3</span> Order Placed
          </span>
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Customer & Shipping Details</h3>
            
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Email</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)' }}>
                <Mail size={16} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }}
                />
              </div>
              {formErrors.email && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.email}</span>}
            </div>

            {/* Name Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  value={shippingForm.firstName}
                  onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.firstName && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.firstName}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  value={shippingForm.lastName}
                  onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.lastName && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.lastName}</span>}
              </div>
            </div>

            {/* Address Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Shipping Address</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)' }}>
                <MapPin size={16} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                <input 
                  type="text" 
                  placeholder="123 Harmony Way, Apt 4B"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }}
                />
              </div>
              {formErrors.address && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.address}</span>}
            </div>

            {/* Location details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>City</label>
                <input 
                  type="text" 
                  placeholder="New York"
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.city && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.city}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>ZIP Code</label>
                <input 
                  type="text" 
                  placeholder="10001"
                  value={shippingForm.zip}
                  onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.zip && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.zip}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Country</label>
                <select 
                  value={shippingForm.country}
                  onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Denmark">Denmark</option>
                </select>
              </div>
            </div>

            {/* Next button */}
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                padding: '16px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '14px',
                marginTop: '12px',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}
              className="checkout-next-btn"
            >
              Continue to Payment — ${cartTotals.total.toFixed(2)}
            </button>
          </form>
        )}

        {/* STEP 2: Payment Simulation */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Secure Payment Method</h3>
              <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontWeight: 600 }}>
                <ShieldCheck size={14} /> SSL Secured
              </span>
            </div>

            {/* Interactive Credit Card Graphic */}
            <div style={{
              background: 'linear-gradient(135deg, #1C1B19 0%, #3C3A35 100%)',
              color: '#FAF9F6',
              padding: '24px 30px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              aspectRatio: '1.6 / 1',
              maxWidth: '340px',
              margin: '0 auto 12px auto',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }} className="credit-card-graphic animate-pop">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#B89260' }}>AURA PRIV PRIVÉ</span>
                <CreditCard size={28} style={{ color: '#B89260' }} />
              </div>

              {/* Number display */}
              <div style={{ fontSize: '18px', wordSpacing: '4px', letterSpacing: '0.15em', margin: '20px 0' }}>
                {paymentForm.cardNumber 
                  ? paymentForm.cardNumber.replace(/(.{4})/g, '$1 ').trim() 
                  : '•••• •••• •••• ••••'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '2px' }}>Cardholder</span>
                  <span>{paymentForm.cardName || 'YOUR FULL NAME'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '2px' }}>Expires</span>
                  <span>{paymentForm.cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Name on Card Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Name on Card</label>
              <input 
                type="text" 
                placeholder="JOHN DOE"
                value={paymentForm.cardName}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value.toUpperCase() })}
                style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
              {formErrors.cardName && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.cardName}</span>}
            </div>

            {/* Card Number Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Card Number</label>
              <input 
                type="text" 
                placeholder="4111 2222 3333 4444"
                value={paymentForm.cardNumber}
                onChange={handleCardNumberChange}
                style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
              {formErrors.cardNumber && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.cardNumber}</span>}
            </div>

            {/* Expiry and CVV Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  value={paymentForm.cardExpiry}
                  onChange={handleExpiryChange}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.cardExpiry && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.cardExpiry}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Code (CVV)</label>
                <input 
                  type="password" 
                  placeholder="•••"
                  maxLength={4}
                  value={paymentForm.cardCvv}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardCvv: e.target.value.replace(/\D/g, '') })}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
                {formErrors.cardCvv && <span style={{ fontSize: '11px', color: '#D26464' }}>{formErrors.cardCvv}</span>}
              </div>
            </div>

            {/* Buttons Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 0.6fr', gap: '16px', marginTop: '12px' }}>
              <button 
                type="button"
                onClick={() => setStep(1)}
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '16px 24px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '13px',
                  textAlign: 'center'
                }}
              >
                Back
              </button>
              <button 
                type="submit"
                style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '16px 24px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                className="checkout-pay-btn"
              >
                Pay & Confirm — ${cartTotals.total.toFixed(2)}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Completed Page */}
        {step === 3 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '30px 0'
          }} className="animate-fade-in">
            {/* Green Tick Animation */}
            <div style={{ color: 'var(--accent)', marginBottom: '24px' }}>
              <CheckCircle2 size={72} strokeWidth={1.5} />
            </div>

            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent)', fontWeight: 600 }}>
              Order Completed
            </span>
            
            <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '16px' }}>
              Thank You for Your Order!
            </h2>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.6' }}>
              Your payment was received successfully. We have sent a detailed order receipt to <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{shippingForm.email}</span>.
            </p>

            {/* Receipt Summary Box */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              margin: '32px 0',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Order ID</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping Address</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {shippingForm.firstName} {shippingForm.lastName}, {shippingForm.address}, {shippingForm.city}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Delivery</span>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>3-5 Business Days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '15px', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-primary)' }}>Total Charged</span>
                <span style={{ color: 'var(--text-primary)' }}>${cartTotals.total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Back to Home Button */}
            <button 
              onClick={onClose}
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.05em',
                transition: 'var(--transition-smooth)'
              }}
              className="checkout-done-btn"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>

      <style>{`
        .checkout-close-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
        }
        .checkout-next-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-1px);
        }
        .checkout-pay-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-1px);
        }
        .checkout-done-btn:hover {
          background-color: var(--accent) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}
