import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import { ShieldCheck, Check, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('dobato_analytics_consent');
      if (!consent && !window.location.pathname.startsWith('/admin')) {
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    analyticsService.setConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    analyticsService.setConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Analytics Preference Banner"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        maxWidth: '420px',
        width: 'calc(100% - 2.5rem)',
        zIndex: 999,
        backgroundColor: 'rgba(22, 10, 29, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(244, 114, 182, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#F472B6', fontWeight: 700, fontSize: '0.95rem' }}>
        <ShieldCheck size={18} />
        <span>Privacy & Analytics Notice</span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
        We use essential session storage for your registration pass. With your permission, we also collect anonymous page analytics to improve the launch experience.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '0.45rem 0.875rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <X size={14} />
          <span>Decline</span>
        </button>

        <button
          onClick={handleAccept}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#EC4899',
            color: '#ffffff',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Check size={14} />
          <span>Accept Analytics</span>
        </button>
      </div>
    </div>
  );
};
