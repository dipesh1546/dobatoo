import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Heart } from 'lucide-react';
import type { IdCardParticipantData } from './types';
import './ParticipantIdCard.css';

interface ParticipantIdCardBackProps {
  data: IdCardParticipantData;
  className?: string;
}

export const ParticipantIdCardBack: React.FC<ParticipantIdCardBackProps> = ({
  data,
  className = '',
}) => {
  const {
    registrationId = 'DBT2026-001',
    fullName = 'Demo Name',
    role = 'PERFORMER PARTICIPANT',
    performanceCategory = 'Poetry',
    eventName = 'DOBATOO GRAND LAUNCH',
    eventDate = '16 October 2026',
    venueName = 'The Gardens, Pani Pokhari',
    verificationUrl = 'https://dobatoo.com/event',
  } = data;

  return (
    <div className={`dobato-id-card-frame ${className}`}>
      {/* Decorative Background Heart */}
      <div className="dobato-id-card-heart-bg" style={{ top: '24px', left: '10px' }}>
        <Heart size={28} color="#8b5cf6" fill="none" strokeWidth={1.3} />
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
          d="M0 30C55 16 105 44 160 24C215 8 255 34 288 20V60H0V30Z"
          fill="url(#back-wave-grad-1)"
          opacity="0.38"
        />
        <path
          d="M0 22C45 40 110 14 155 34C200 50 245 26 288 38V60H0V22Z"
          fill="url(#back-wave-grad-2)"
          opacity="0.48"
        />
        <defs>
          <linearGradient id="back-wave-grad-1" x1="0" y1="0" x2="288" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="0.5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="back-wave-grad-2" x1="0" y1="0" x2="288" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333ea" />
            <stop offset="0.7" stopColor="#ec4899" />
            <stop offset="1" stopColor="#4c0519" />
          </linearGradient>
        </defs>
      </svg>

      {/* Card Content Layer */}
      <div className="dobato-id-card-content">
        {/* 1. TOP HEADER: LOGO & TAGLINES */}
        <div className="dobato-id-card-back-header">
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

          {/* Both Brand Taglines */}
          <div className="dobato-id-card-main-tagline">
            Two Paths. One Connection.
          </div>
          <div className="dobato-id-card-secondary-tagline">
            Where Paths Cross, Stories Begin.
          </div>
        </div>

        {/* 2. ROUNDED INFORMATION PANEL */}
        <div className="dobato-id-card-info-panel">
          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Participant ID</span>
            <span className="dobato-id-card-info-value dobato-id-card-info-value-highlight">
              {registrationId}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Name</span>
            <span className="dobato-id-card-info-value" title={fullName}>
              {fullName}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Role</span>
            <span className="dobato-id-card-info-value" style={{ color: '#fbcfe8' }}>
              {role}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Category</span>
            <span className="dobato-id-card-info-value">
              {performanceCategory}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Event</span>
            <span className="dobato-id-card-info-value">
              {eventName}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Date</span>
            <span className="dobato-id-card-info-value">
              {eventDate}
            </span>
          </div>

          <div className="dobato-id-card-info-row">
            <span className="dobato-id-card-info-label">Location</span>
            <span className="dobato-id-card-info-value" title={venueName}>
              {venueName}
            </span>
          </div>
        </div>

        {/* 3. LOWER SECTION: QR CODE + TEXT + DECORATIVE HEART OUTLINE */}
        <div className="dobato-id-card-qr-section">
          {/* Genuine QR Code */}
          <div className="dobato-id-card-qr-box">
            <QRCodeSVG
              value={verificationUrl}
              size={54}
              bgColor="#FFFFFF"
              fgColor="#110829"
              level="M"
              marginSize={0}
            />
          </div>

          {/* Text Beside QR Code */}
          <div className="dobato-id-card-qr-text-col">
            <div className="dobato-id-card-scan-label">
              SCAN FOR EVENT DETAILS
            </div>
            <div className="dobato-id-card-scan-sublabel">
              Official Dobatoo Pass Verification
            </div>
          </div>

          {/* Decorative Heart Outline on Right */}
          <div className="dobato-id-card-back-heart-decor">
            <Heart size={36} color="#ec4899" fill="none" strokeWidth={1.5} />
          </div>
        </div>

        {/* 4. BOTTOM: WEBSITE & SOCIAL ICONS */}
        <div className="dobato-id-card-back-footer">
          <a
            href="https://www.dobatoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dobato-id-card-website"
          >
            www.dobatoo.com
          </a>

          <div className="dobato-id-card-socials">
            {/* Instagram */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dobato-id-card-social-icon">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            {/* Facebook */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dobato-id-card-social-icon">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            {/* YouTube */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dobato-id-card-social-icon">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
