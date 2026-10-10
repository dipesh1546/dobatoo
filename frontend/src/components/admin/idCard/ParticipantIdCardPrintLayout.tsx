import React from 'react';
import { ParticipantIdCardFront } from './ParticipantIdCardFront';
import { ParticipantIdCardBack } from './ParticipantIdCardBack';
import type { IdCardParticipantData } from './types';
import './ParticipantIdCard.css';

export type PrintMode = 'duplex' | 'sheet' | 'front-only' | 'back-only';

interface ParticipantIdCardPrintLayoutProps {
  cards: IdCardParticipantData[];
  mode?: PrintMode;
}

export const ParticipantIdCardPrintLayout: React.FC<ParticipantIdCardPrintLayoutProps> = ({
  cards,
  mode = 'duplex',
}) => {
  return (
    <div id="dobato-id-card-print-root">
      {cards.map((data, index) => {
        const keyPrefix = `print-card-${data.id || data.registrationId || index}`;

        if (mode === 'sheet') {
          // A4 / Letter side-by-side sheet layout with cut marks
          return (
            <div key={keyPrefix} className="dobato-print-sheet-mode">
              <div className="dobato-id-card-print-page">
                <ParticipantIdCardFront data={data} />
              </div>
              <div className="dobato-id-card-print-page">
                <ParticipantIdCardBack data={data} />
              </div>
            </div>
          );
        }

        if (mode === 'front-only') {
          return (
            <div key={`${keyPrefix}-front`} className="dobato-id-card-print-page">
              <ParticipantIdCardFront data={data} />
            </div>
          );
        }

        if (mode === 'back-only') {
          return (
            <div key={`${keyPrefix}-back`} className="dobato-id-card-print-page">
              <ParticipantIdCardBack data={data} />
            </div>
          );
        }

        // Default 'duplex': Page 1 Front, Page 2 Back
        return (
          <React.Fragment key={keyPrefix}>
            <div className="dobato-id-card-print-page">
              <ParticipantIdCardFront data={data} />
            </div>
            <div className="dobato-id-card-print-page">
              <ParticipantIdCardBack data={data} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
