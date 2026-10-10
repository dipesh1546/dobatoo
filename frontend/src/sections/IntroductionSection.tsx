import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { BRAND_SLOGAN } from '../constants/brand';
import './sections.css';

export const IntroductionSection: React.FC = () => {
  return (
    <Section id="intro" variant="dark" padding="lg">
      <Container size="md" style={{ textAlign: 'center' }}>
        <Heading as="h2" fontFamily="serif" style={{ marginBottom: '2rem' }}>
          Every connection <GradientText variant="romantic">starts somewhere.</GradientText>
        </Heading>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            fontSize: '1.2rem',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.88)',
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          <p>Everyone walks a different path.</p>
          <p style={{ color: 'var(--dobato-muted)' }}>
            Different places. Different stories. Different dreams.
          </p>
          <p>
            And sometimes, two completely different paths cross at exactly the right moment.
          </p>
          <p style={{ fontWeight: 600, color: 'var(--dobato-white)' }}>
            That moment is <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span>.
          </p>
        </div>

        {/* Elegant Visual Path Divider */}
        <div className="path-divider" aria-hidden="true">
          <div className="path-divider-line" />
          <div className="path-divider-node" />
          <div className="path-divider-line" />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 600,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            "{BRAND_SLOGAN}"
          </span>
        </div>
      </Container>
    </Section>
  );
};
