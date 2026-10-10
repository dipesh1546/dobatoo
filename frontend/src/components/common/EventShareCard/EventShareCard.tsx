import React, { useState } from 'react';
import { Share2, Check, Link2, MessageCircle, Send, Sparkles, Calendar } from 'lucide-react';
import { Logo } from '../Logo/Logo';
import { Card } from '../../ui/Card/Card';
import { Badge } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { Link } from 'react-router-dom';

interface EventShareCardProps {
  referralCode?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const EventShareCard: React.FC<EventShareCardProps> = ({
  referralCode,
  className = '',
  style = {},
}) => {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dobato.app';
  const shareUrl = referralCode
    ? `${baseUrl}/register?ref=${encodeURIComponent(referralCode)}`
    : `${baseUrl}/register?utm_source=social_share&utm_medium=card&utm_campaign=dobato_launch`;

  const shareText =
    "Something special is happening at Dobatoo ❤️\n\nDobatoo Grand Launch\n16 October 2026\nThe Gardens, Panipokhari, Kathmandu, Nepal\n\nPoetry • Music • Connections\n\nTwo Paths. One Connection.\n\nRegister for FREE:";

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Dobatoo Grand Launch',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <Card
      variant="glass"
      glow
      className={className}
      style={{
        padding: '2rem',
        maxWidth: '540px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(59, 18, 63, 0.9) 0%, rgba(22, 10, 29, 0.95) 100%)',
        border: '1px solid rgba(244, 114, 182, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <Logo size="md" />
      </div>

      <Badge variant="romantic" size="md" icon={<Sparkles size={14} />} style={{ marginBottom: '1rem' }}>
        OFFICIAL EVENT INVITATION
      </Badge>

      <h3 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--dobato-white)', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)' }}>
        DOBATOO GRAND LAUNCH
      </h3>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F472B6', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
        <Calendar size={16} />
        <span>16 October 2026</span>
      </div>

      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '0.75rem' }}>
        The Gardens • Panipokhari, Kathmandu
      </div>

      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1rem', letterSpacing: '0.02em' }}>
        Poetry • Music • Connections
      </div>

      <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#F472B6', margin: '0 0 1.5rem 0', fontWeight: 600 }}>
        "Two Paths. One Connection."
      </p>

      <div style={{ marginBottom: '1.75rem' }}>
        <Link to={`/register${referralCode ? `?ref=${referralCode}` : ''}`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" style={{ width: '100%', height: '48px', fontSize: '1rem' }}>
            REGISTER FOR FREE
          </Button>
        </Link>
      </div>

      {/* Social Share Buttons */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.25rem' }}>
        <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, marginBottom: '0.875rem' }}>
          SHARE WITH FRIENDS & COMMUNITY
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              style={{
                height: '38px',
                padding: '0 0.875rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: '38px',
              padding: '0 0.875rem',
              borderRadius: '8px',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: '38px',
              padding: '0 0.875rem',
              borderRadius: '8px',
              border: '1px solid rgba(24, 119, 242, 0.4)',
              backgroundColor: 'rgba(24, 119, 242, 0.15)',
              color: '#1877F2',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <span>Facebook</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: '38px',
              padding: '0 0.875rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <span>X (Twitter)</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: '38px',
              padding: '0 0.875rem',
              borderRadius: '8px',
              border: '1px solid rgba(0, 136, 204, 0.4)',
              backgroundColor: 'rgba(0, 136, 204, 0.15)',
              color: '#0088cc',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <Send size={14} />
            <span>Telegram</span>
          </a>

          <button
            onClick={handleCopy}
            style={{
              height: '38px',
              padding: '0 0.875rem',
              borderRadius: '8px',
              border: '1px solid rgba(244, 114, 182, 0.4)',
              backgroundColor: 'rgba(244, 114, 182, 0.15)',
              color: '#F472B6',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
