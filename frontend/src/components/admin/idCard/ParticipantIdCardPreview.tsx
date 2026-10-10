import React, { useState } from 'react';
import { ParticipantIdCardFront } from './ParticipantIdCardFront';
import { ParticipantIdCardBack } from './ParticipantIdCardBack';
import type { IdCardParticipantData } from './types';
import { Layers, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import './ParticipantIdCard.css';

interface ParticipantIdCardPreviewProps {
  data: IdCardParticipantData;
}

export const ParticipantIdCardPreview: React.FC<ParticipantIdCardPreviewProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'both' | 'flip' | 'front' | 'back'>('both');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  // Default zoom 1.25 so cards are prominent, clear and legible on modern desktop displays
  const [zoom, setZoom] = useState<number>(1.25);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
      {/* Top Preview Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.5rem 0.85rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.09)',
        }}
      >
        {/* View Mode Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="admin-btn"
            style={{
              height: '32px',
              fontSize: '0.75rem',
              padding: '0 0.65rem',
              backgroundColor: viewMode === 'both' ? '#7c3aed' : 'transparent',
              color: viewMode === 'both' ? '#ffffff' : '#cbd5e1',
              border: viewMode === 'both' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              fontWeight: 600,
            }}
            onClick={() => setViewMode('both')}
          >
            <Layers size={13} />
            <span>Side-by-Side</span>
          </button>

          <button
            type="button"
            className="admin-btn"
            style={{
              height: '32px',
              fontSize: '0.75rem',
              padding: '0 0.65rem',
              backgroundColor: viewMode === 'flip' ? '#7c3aed' : 'transparent',
              color: viewMode === 'flip' ? '#ffffff' : '#cbd5e1',
              border: viewMode === 'flip' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              fontWeight: 600,
            }}
            onClick={() => setViewMode('flip')}
          >
            <RotateCcw size={13} />
            <span>3D Flip View</span>
          </button>

          <button
            type="button"
            className="admin-btn"
            style={{
              height: '32px',
              fontSize: '0.75rem',
              padding: '0 0.65rem',
              backgroundColor: viewMode === 'front' ? '#7c3aed' : 'transparent',
              color: viewMode === 'front' ? '#ffffff' : '#cbd5e1',
              border: viewMode === 'front' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              fontWeight: 600,
            }}
            onClick={() => setViewMode('front')}
          >
            <span>Front Only</span>
          </button>

          <button
            type="button"
            className="admin-btn"
            style={{
              height: '32px',
              fontSize: '0.75rem',
              padding: '0 0.65rem',
              backgroundColor: viewMode === 'back' ? '#7c3aed' : 'transparent',
              color: viewMode === 'back' ? '#ffffff' : '#cbd5e1',
              border: viewMode === 'back' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              fontWeight: 600,
            }}
            onClick={() => setViewMode('back')}
          >
            <span>Back Only</span>
          </button>
        </div>

        {/* Dimension & Zoom Indicator & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              padding: '0.2rem 0.55rem',
              borderRadius: '5px',
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              color: '#f472b6',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              fontWeight: 700,
            }}
            title="Physical print dimensions: exactly 3 inches wide by 4 inches tall"
          >
            Print Size: 3" × 4" (76.2 × 101.6 mm)
          </div>

          {/* Quick 100% / Fit toggle */}
          <button
            type="button"
            className="admin-btn"
            style={{
              height: '28px',
              fontSize: '0.7rem',
              padding: '0 0.45rem',
              backgroundColor: zoom === 1 ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              color: zoom === 1 ? '#fbcfe8' : '#cbd5e1',
              border: zoom === 1 ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setZoom(zoom === 1 ? 1.25 : 1)}
            title="Toggle between 100% (Actual Print Scale) and 125% (Preview Size)"
          >
            <Maximize2 size={11} />
            <span>{zoom === 1 ? '100% (Actual)' : '100% Scale'}</span>
          </button>

          {/* Zoom In/Out Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              className="admin-btn"
              style={{ height: '28px', width: '28px', padding: 0, justifyContent: 'center' }}
              onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                minWidth: '40px',
                textAlign: 'center',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="admin-btn"
              style={{ height: '28px', width: '28px', padding: 0, justifyContent: 'center' }}
              onClick={() => setZoom((z) => Math.min(1.7, Number((z + 0.15).toFixed(2))))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Stage Container */}
      <div className="dobato-idcard-preview-stage-wrapper">
        <div
          className="dobato-idcard-preview-stage"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          {/* SIDE-BY-SIDE MODE */}
          {viewMode === 'both' && (
            <>
              <div className="dobato-idcard-card-container">
                <span className="dobato-idcard-card-label">FRONT SIDE (3" × 4")</span>
                <ParticipantIdCardFront data={data} />
              </div>

              <div className="dobato-idcard-card-container">
                <span className="dobato-idcard-card-label">BACK SIDE (3" × 4")</span>
                <ParticipantIdCardBack data={data} />
              </div>
            </>
          )}

          {/* 3D FLIP MODE */}
          {viewMode === 'flip' && (
            <div className="dobato-idcard-card-container">
              <span className="dobato-idcard-card-label">
                {isFlipped ? 'BACK SIDE (CLICK CARD TO FLIP)' : 'FRONT SIDE (CLICK CARD TO FLIP)'}
              </span>
              <div
                style={{
                  perspective: '1200px',
                  cursor: 'pointer',
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                title="Click to flip card"
              >
                <div
                  style={{
                    position: 'relative',
                    width: '3in',
                    height: '4in',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front Side */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <ParticipantIdCardFront data={data} />
                  </div>

                  {/* Back Side */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <ParticipantIdCardBack data={data} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{
                  marginTop: '0.85rem',
                  height: '32px',
                  fontSize: '0.75rem',
                  borderColor: '#ec4899',
                  color: '#fbcfe8',
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <RotateCcw size={13} />
                <span>Flip to {isFlipped ? 'Front Side' : 'Back Side'}</span>
              </button>
            </div>
          )}

          {/* FRONT ONLY MODE */}
          {viewMode === 'front' && (
            <div className="dobato-idcard-card-container">
              <span className="dobato-idcard-card-label">FRONT SIDE (3" × 4")</span>
              <ParticipantIdCardFront data={data} />
            </div>
          )}

          {/* BACK ONLY MODE */}
          {viewMode === 'back' && (
            <div className="dobato-idcard-card-container">
              <span className="dobato-idcard-card-label">BACK SIDE (3" × 4")</span>
              <ParticipantIdCardBack data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
