import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  X,
  Printer,
  FileText,
  HelpCircle,
  Download,
  Sparkles,
} from 'lucide-react';
import { ParticipantIdCardPreview } from './ParticipantIdCardPreview';
import { ParticipantIdCardPrintLayout, type PrintMode } from './ParticipantIdCardPrintLayout';
import { normalizeToIdCardData, DEMO_ID_CARD_DATA, type IdCardParticipantData } from './types';
import './ParticipantIdCard.css';

interface ParticipantIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Single participant or list of participants for bulk */
  participant?: any;
  participantsList?: any[];
}

export const ParticipantIdCardModal: React.FC<ParticipantIdCardModalProps> = ({
  isOpen,
  onClose,
  participant,
  participantsList,
}) => {
  const [useDemo, setUseDemo] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>('duplex');
  const [showDuplexHelp, setShowDuplexHelp] = useState(false);
  const [downloadingSide, setDownloadingSide] = useState<'front' | 'back' | null>(null);

  if (!isOpen) return null;

  // Single card data or multiple
  const isBulk = Boolean(participantsList && participantsList.length > 1);
  const activeData: IdCardParticipantData = useDemo
    ? DEMO_ID_CARD_DATA
    : normalizeToIdCardData(participant || (participantsList && participantsList[0]));

  const allCards: IdCardParticipantData[] = isBulk && !useDemo
    ? (participantsList || []).map(normalizeToIdCardData)
    : [activeData];

  const handlePrint = (mode: PrintMode) => {
    setPrintMode(mode);
    // Allow React state to update the print layout before calling window.print()
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPng = async (side: 'front' | 'back') => {
    setDownloadingSide(side);
    try {
      // Find the card element in the preview
      const cardElements = document.querySelectorAll('.dobato-idcard-preview-stage .dobato-id-card-frame');
      const targetElement = side === 'front' ? cardElements[0] : (cardElements[1] || cardElements[0]);

      if (targetElement) {
        const canvas = await html2canvas(targetElement as HTMLElement, {
          scale: 3, // High DPI export
          useCORS: true,
          backgroundColor: '#0c071d',
        });

        const link = document.createElement('a');
        link.download = `dobato-id-card-${activeData.registrationId}-${side}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('[Download PNG Error]', err);
    } finally {
      setDownloadingSide(null);
    }
  };

  return (
    <>
      {/* On-Screen Modal Dialog */}
      <div className="dobato-idcard-modal-backdrop no-print" onClick={onClose}>
        <div
          className="dobato-idcard-modal-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="dobato-idcard-modal-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    color: '#f472b6',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  3" × 4" ID BADGE
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Participant ID Card
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                {isBulk
                  ? `Batch ID card preview for ${allCards.length} selected participants`
                  : `Official Performer ID Pass for ${activeData.fullName} (${activeData.registrationId})`}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="admin-btn"
                style={{
                  height: '32px',
                  fontSize: '0.75rem',
                  backgroundColor: useDemo ? '#db2777' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                }}
                onClick={() => setUseDemo(!useDemo)}
                title="Toggle Demo Data Mode"
              >
                <Sparkles size={13} />
                <span>{useDemo ? 'Using Demo Data' : 'Preview Demo Data'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="admin-btn"
                style={{ height: '32px', width: '32px', padding: 0, justifyContent: 'center' }}
                title="Close Modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="dobato-idcard-modal-body">
            {/* Interactive Preview of Front & Back */}
            <ParticipantIdCardPreview data={activeData} />

            {/* Duplex Printing Instructions Box */}
            <div
              style={{
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setShowDuplexHelp(!showDuplexHelp)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: '#f472b6',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={15} />
                  <span>Double-Sided (Duplex) Printing Guidelines & Settings</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {showDuplexHelp ? 'Hide ▲' : 'Show Instructions ▼'}
                </span>
              </button>

              {showDuplexHelp && (
                <div
                  style={{
                    padding: '0.875rem 1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    To ensure the front and back align perfectly on physical cardstock or PVC ID badge printers:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>
                      <strong>Printer Scale:</strong> Select <strong>100%</strong> or <strong>Custom: 100%</strong> (Do NOT select "Fit to Printable Area").
                    </li>
                    <li>
                      <strong>Margins:</strong> Set margins to <strong>None</strong> (or 0 mm) in the browser print dialog.
                    </li>
                    <li>
                      <strong>Two-Sided / Duplex Setting:</strong> If printing on a duplex printer, select <strong>Flip on Short Edge</strong> (since cards are in portrait 3" × 4" orientation).
                    </li>
                    <li>
                      <strong>Standard Desktop Printers (A4 / Letter):</strong> Use the <em>"Print A4 Sheet"</em> button below to print both sides side-by-side with cut guidelines so you can fold or cut them cleanly.
                    </li>
                    <li>
                      <strong>Paper Quality:</strong> For premium presentation, print on 250–300 GSM glossy or matte cardstock.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="dobato-idcard-actions-bar">
              {/* Export / Download Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ height: '36px', fontSize: '0.8125rem' }}
                  onClick={() => handleDownloadPng('front')}
                  disabled={downloadingSide !== null}
                >
                  <Download size={14} />
                  <span>{downloadingSide === 'front' ? 'Exporting...' : 'Save Front PNG'}</span>
                </button>

                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ height: '36px', fontSize: '0.8125rem' }}
                  onClick={() => handleDownloadPng('back')}
                  disabled={downloadingSide !== null}
                >
                  <Download size={14} />
                  <span>{downloadingSide === 'back' ? 'Exporting...' : 'Save Back PNG'}</span>
                </button>
              </div>

              {/* Print Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ height: '36px', fontSize: '0.8125rem' }}
                  onClick={() => handlePrint('sheet')}
                  title="Print both sides side-by-side on an A4/Letter page"
                >
                  <FileText size={14} />
                  <span>Print A4 Sheet (Side-by-Side)</span>
                </button>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  style={{
                    height: '36px',
                    fontSize: '0.8125rem',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    border: 'none',
                    fontWeight: 700,
                  }}
                  onClick={() => handlePrint('duplex')}
                  title="Print at exact 3x4 inches (Page 1 Front, Page 2 Back)"
                >
                  <Printer size={15} />
                  <span>
                    {isBulk
                      ? `Print ${allCards.length} Selected Cards (3"×4")`
                      : 'Print ID Card (3" × 4" Duplex)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Print Engine Target (Only visible when printing) */}
      <ParticipantIdCardPrintLayout cards={allCards} mode={printMode} />
    </>
  );
};
