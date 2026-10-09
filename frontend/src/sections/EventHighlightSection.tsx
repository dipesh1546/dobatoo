import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { EVENT_TIMELINE } from '../constants/event';
import { EVENT_DATE } from '../constants/brand';
import { Calendar } from 'lucide-react';
import './sections.css';

export const EventHighlightSection: React.FC = () => {
  return (
    <Section variant="dark" padding="xl" style={{ backgroundColor: '#13071A' }}>
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--dobato-pink)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            <Calendar size={16} /> {EVENT_DATE}
          </div>

          <Heading as="h2" fontFamily="serif">
            One evening. <GradientText variant="primary">Many stories.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginTop: '1rem' }}>
            Come celebrate the beginning of DOBATO with an evening filled with poetry, music and people coming together from different paths.
          </p>
        </div>

        {/* Visual Flow Timeline */}
        <div className="timeline-container">
          {EVENT_TIMELINE.map((step) => (
            <div key={step.title} className="timeline-card">
              <span className="timeline-badge">{step.label}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dobato-white)', marginBottom: '0.5rem' }}>
                {step.title}
              </h3>
              <p className="text-body-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
