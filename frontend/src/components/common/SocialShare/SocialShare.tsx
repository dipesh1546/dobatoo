import React, { useState } from 'react';
import { Share2, Check, Link2, MessageCircle } from 'lucide-react';
import './SocialShare.css';

interface SocialShareProps {
  title?: string;
  shareText?: string;
  shareUrl?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title = 'Invite Friends to DOBATO',
  shareText = 'Join the DOBATO Grand Launch on 16 October 2026 — an evening of poetry, music and meaningful connections. Two Paths. One Connection.',
  shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://dobato.app',
}) => {
  const [copied, setCopied] = useState(false);

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
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DOBATO Grand Launch',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

  return (
    <div className="dobato-share-container">
      <div className="dobato-share-title">
        <Share2 size={16} color="#F472B6" />
        <span>{title}</span>
      </div>

      <div className="dobato-share-buttons">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button className="dobato-share-btn" onClick={handleNativeShare}>
            <Share2 size={14} />
            Share Event
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dobato-share-btn"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={14} color="#25D366" />
          WhatsApp
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dobato-share-btn"
          aria-label="Share on Facebook"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
          Facebook
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dobato-share-btn"
          aria-label="Share on X (Twitter)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
          </svg>
          X
        </a>

        <button className="dobato-share-btn" onClick={handleCopy}>
          {copied ? <Check size={14} color="#F472B6" /> : <Link2 size={14} />}
          {copied ? 'Link Copied!' : 'Copy Link'}
        </button>
      </div>

      {copied && <span className="dobato-share-toast">Event details link copied to clipboard!</span>}
    </div>
  );
};
