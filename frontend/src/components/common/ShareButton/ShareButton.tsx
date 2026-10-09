import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import type { ButtonVariant } from '../../../types/components';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'DOBATO Grand Launch',
  text = 'Join the DOBATO Grand Launch on 16 October 2026 — an evening of poetry, music and meaningful connections. Two Paths. One Connection.',
  url = typeof window !== 'undefined' ? window.location.href : 'https://dobato.app',
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback failed
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant={variant}
        size={size}
        className={className}
        style={style}
        onClick={handleShare}
        icon={copied ? <Check size={16} /> : <Share2 size={16} />}
      >
        {copied ? 'Invite Link Copied!' : 'Share Event'}
      </Button>

      {copied && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '0.5rem',
            backgroundColor: '#160A1D',
            color: '#F472B6',
            border: '1px solid rgba(244, 114, 182, 0.4)',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 50,
          }}
        >
          Invite link copied!
        </div>
      )}
    </div>
  );
};
