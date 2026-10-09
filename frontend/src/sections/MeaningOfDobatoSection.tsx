import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Badge } from '../components/ui/Badge/Badge';
import { BRAND_CAMPAIGN_LINE } from '../constants/brand';
import './sections.css';

export const MeaningOfDobatoSection: React.FC = () => {
  return (
    <Section id="about" variant="dark" padding="lg">
      <Container size="xl">
        <div className="meaning-split-grid">
          {/* Left Column: Typography & Emotional Storytelling */}
          <div>
            <Badge variant="romantic" size="sm" style={{ marginBottom: '1.25rem' }}>
              The Story Behind the Name
            </Badge>

            <Heading as="h2" fontFamily="sans" style={{ marginBottom: '1rem' }}>
              Why <GradientText variant="primary">DOBATO?</GradientText>
            </Heading>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--dobato-pink)',
                lineHeight: '1.3',
                marginBottom: '1.5rem',
              }}
            >
              "Two paths don't have to stay separate."
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '1.05rem',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
              }}
            >
              <p>
                DOBATO represents the moment when two different journeys meet.
              </p>

              <div
                style={{
                  paddingLeft: '1.25rem',
                  borderLeft: '3px solid var(--dobato-magenta)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  color: 'var(--dobato-white)',
                  fontWeight: 500,
                }}
              >
                <span>A chance encounter.</span>
                <span>A conversation.</span>
                <span>A connection.</span>
                <span style={{ color: 'var(--dobato-pink)' }}>Maybe even a story that lasts.</span>
              </div>
            </div>

            <p className="text-body-sm" style={{ fontStyle: 'italic', opacity: 0.8 }}>
              "{BRAND_CAMPAIGN_LINE}"
            </p>
          </div>

          {/* Right Column: Abstract Visual Composition of Two Paths Crossing */}
          <div className="meaning-visual-card">
            <svg
              width="100%"
              height="280"
              viewBox="0 0 320 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Abstract illustration of two paths crossing into one heart"
            >
              <defs>
                <linearGradient id="meaning-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>

                <linearGradient id="meaning-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#7E22CE" />
                </linearGradient>

                <filter id="meaning-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <path
                d="M 20,220 C 80,180 100,100 160,100 C 220,100 240,160 300,140"
                stroke="url(#meaning-grad-1)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                filter="url(#meaning-blur)"
              />

              <path
                d="M 300,220 C 240,180 220,100 160,100 C 100,100 80,160 20,140"
                stroke="url(#meaning-grad-2)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                filter="url(#meaning-blur)"
              />

              <circle cx="160" cy="100" r="28" fill="rgba(244, 114, 182, 0.15)" stroke="var(--dobato-pink)" strokeWidth="2" />
              <circle cx="160" cy="100" r="10" fill="#FFFFFF" filter="url(#meaning-blur)" />
            </svg>

            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--dobato-white)' }}>
                Two Paths. One Connection.
              </span>
              <p className="text-body-sm" style={{ marginTop: '0.5rem' }}>
                दो बाटो — जहाँ दुई फरक यात्राका रेखा हरू जोडिन्छन्।
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
