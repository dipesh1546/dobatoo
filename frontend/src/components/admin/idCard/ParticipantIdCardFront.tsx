import React, { useState, useEffect } from 'react';
import { Mic, Heart } from 'lucide-react';
import type { IdCardParticipantData } from './types';
import './ParticipantIdCard.css';

interface ParticipantIdCardFrontProps {
  data: IdCardParticipantData;
  className?: string;
}

export const ParticipantIdCardFront: React.FC<ParticipantIdCardFrontProps> = ({
  data,
  className = '',
}) => {
  const {
    fullName = 'Demo Name',
    photoUrl,
    role = 'PERFORMER PARTICIPANT',
    performanceCategory = 'Poetry',
    eventName = 'DOBATOO GRAND LAUNCH',
    eventDate = '16 October 2026',
    venueName = 'The Gardens, Pani Pokhari',
  } = data;

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  const firstInitial = fullName ? fullName.trim().charAt(0).toUpperCase() : 'D';
  const hasValidPhoto = Boolean(photoUrl && photoUrl.trim() && !imgError);

  return (
    <div className={`dobato-id-card-frame ${className}`}>
      {/* Decorative Floating Hearts */}
      <div className="dobato-id-card-heart-bg" style={{ top: '34px', left: '10px' }}>
        <Heart size={26} color="#ec4899" fill="none" strokeWidth={1.5} />
      </div>
      <div className="dobato-id-card-heart-bg" style={{ top: '85px', right: '10px' }}>
        <Heart size={32} color="#d946ef" fill="none" strokeWidth={1.2} />
      </div>
      <div className="dobato-id-card-heart-bg" style={{ bottom: '46px', left: '12px' }}>
        <Heart size={22} color="#8b5cf6" fill="none" strokeWidth={1.4} />
      </div>

      {/* Decorative Bottom Flowing Waves SVG */}
      <svg
        className="dobato-id-card-bottom-waves"
        viewBox="0 0 288 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 26C45 42 95 12 144 26C193 40 240 18 288 32V60H0V26Z"
          fill="url(#front-wave-grad-1)"
          opacity="0.38"
        />
        <path
          d="M0 36C50 18 100 45 150 28C200 12 250 36 288 26V60H0V36Z"
          fill="url(#front-wave-grad-2)"
          opacity="0.48"
        />
        <defs>
          <linearGradient id="front-wave-grad-1" x1="0" y1="0" x2="288" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="0.5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="front-wave-grad-2" x1="0" y1="0" x2="288" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="0.6" stopColor="#9333ea" />
            <stop offset="1" stopColor="#3b0764" />
          </linearGradient>
        </defs>
      </svg>

      {/* Card Content Layer */}
      <div className="dobato-id-card-content">
        {/* 1. TOP HEADER: LOGO & TAGLINES */}
        <div className="dobato-id-card-front-header">
          {/* Logo row */}
          <div className="dobato-id-card-logo-row">
            <img
              src="/favicon.png"
              alt="DOBATOO"
              className="dobato-id-card-logo-icon"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="dobato-id-card-logo-wordmark">
              DOBATO<span className="dobato-id-card-logo-accent">O</span>
            </span>
          </div>

          {/* Main Tagline */}
          <div className="dobato-id-card-main-tagline">
            Two Paths. One Connection.
          </div>

          {/* Secondary Tagline */}
          <div className="dobato-id-card-secondary-tagline">
            Where Paths Cross, Stories Begin.
          </div>
        </div>

        {/* 2. LARGE CIRCULAR PARTICIPANT PHOTOGRAPH WITH PINK-VIOLET BORDER */}
        <div className="dobato-id-card-photo-wrapper">
          <div className="dobato-id-card-photo-ring">
            {hasValidPhoto ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="dobato-id-card-photo"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="dobato-id-card-photo-fallback">
                <Mic size={42} className="dobato-id-card-photo-fallback-watermark" />
                <span className="dobato-id-card-photo-fallback-initial">{firstInitial}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. PARTICIPANT NAME, ROLE, AND CATEGORY */}
        <div className="dobato-id-card-details-section">
          <div className="dobato-id-card-name-panel">
            <div className="dobato-id-card-name" title={fullName}>
              {fullName}
            </div>
          </div>

          <div className="dobato-id-card-role-badge">
            {role}
          </div>

          <div className="dobato-id-card-category-row">
            <Mic size={10} color="#ec4899" strokeWidth={2.5} />
            <span className="dobato-id-card-category-text">
              {performanceCategory}
            </span>
          </div>
        </div>

        {/* 4. EVENT FOOTER */}
        <div className="dobato-id-card-front-footer">
          <div className="dobato-id-card-event-name">
            {eventName}
          </div>
          <div className="dobato-id-card-event-details-row">
            <span>{eventDate}</span>
            <span className="dobato-id-card-event-dot"></span>
            <span title={venueName}>{venueName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
