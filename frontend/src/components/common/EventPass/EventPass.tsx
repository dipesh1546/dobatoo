import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Logo } from '../Logo/Logo';
import { Button } from '../../ui/Button/Button';
import { EVENT_DATE, BRAND_SLOGAN, EVENT_VENUE_NAME, EVENT_VENUE_LOCATION } from '../../../constants/brand';
import { Copy, Check, Download } from 'lucide-react';
import './EventPass.css';

interface EventPassProps {
  registrationId: string;
  verificationToken?: string;
  participationType?: string;
}

export const EventPass: React.FC<EventPassProps> = ({
  registrationId,
  verificationToken = 'token_sec_' + registrationId,
  participationType = 'ATTEND_ONLY',
}) => {
  const passRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dobato.app';
  const qrVerificationUrl = `${origin}/verify?token=${encodeURIComponent(verificationToken)}`;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadPass = async () => {
    if (!passRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(passRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });

      const link = document.createElement('a');
      link.download = `dobato-event-pass-${registrationId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('[Event Pass Download Error]', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="dobato-pass-wrapper">
      {/* Printable / Downloadable Event Pass Card */}
      <div ref={passRef} className="dobato-pass-card">
        <div className="dobato-pass-header">
          <Logo variant="dark" size="md" />
          <div className="dobato-pass-title">DOBATO GRAND LAUNCH</div>
          <div className="dobato-pass-date">{EVENT_DATE}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#3B123F', marginTop: '0.2rem' }}>
            {EVENT_VENUE_NAME} • {EVENT_VENUE_LOCATION}
          </div>
        </div>

        <div className="dobato-pass-id-box">
          <div className="dobato-pass-id-label">YOUR REGISTRATION ID</div>
          <div className="dobato-pass-id-value">{registrationId}</div>
        </div>

        {/* High Scannability QR Code Box */}
        <div className="dobato-pass-qr-wrapper">
          <QRCodeSVG
            value={qrVerificationUrl}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#160A1D"
            level="H"
            marginSize={2}
            aria-label="Event registration QR code for DOBATO."
          />
          <div className="dobato-pass-checkin-note">
            Official DOBATO Registration Pass
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6B6170', fontWeight: 600, marginTop: '0.5rem' }}>
          Pass Type: {participationType === 'ATTEND_AND_POETRY' ? 'Event Attendance + Poetry' : 'Event Attendance'}
        </div>

        <div className="dobato-pass-footer-slogan">
          "{BRAND_SLOGAN}"
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dobato-pass-actions">
        <Button
          variant="outline"
          size="md"
          onClick={handleCopyId}
          icon={copiedId ? <Check size={16} color="#F472B6" /> : <Copy size={16} />}
          aria-label="Copy Registration ID"
        >
          {copiedId ? 'Copied!' : 'Copy ID'}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={handleDownloadPass}
          isLoading={isDownloading}
          disabled={isDownloading}
          icon={<Download size={16} />}
          aria-label="Save Event Pass as image"
        >
          {isDownloading ? 'Saving Pass...' : 'Save Event Pass'}
        </Button>
      </div>

      <p className="text-body-sm" style={{ opacity: 0.7, marginTop: '0.25rem' }}>
        💡 Tip: Increase your screen brightness for fast scanning at the venue.
      </p>
    </div>
  );
};
