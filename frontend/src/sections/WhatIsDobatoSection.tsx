import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { WHAT_IS_DOBATO_CARDS } from '../constants/event';
import { Compass, Zap, HeartHandshake } from 'lucide-react';
import './sections.css';

export const WhatIsDobatoSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass size={28} color="#F472B6" />;
      case 'Zap':
        return <Zap size={28} color="#D946EF" />;
      case 'HeartHandshake':
        return <HeartHandshake size={28} color="#A855F7" />;
      default:
        return <Compass size={28} color="#F472B6" />;
    }
  };

  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
          <Heading as="h2" fontFamily="sans">
            What is <GradientText variant="primary">Dobatoo?</GradientText>
          </Heading>
          <p className="text-body-lg" style={{ marginTop: '1rem' }}>
            <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span> is a Nepali dating and meaningful-connection platform designed to help people discover new people, start genuine conversations and create meaningful relationships.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {WHAT_IS_DOBATO_CARDS.map((card) => (
            <Card key={card.id} variant="glass" hoverEffect glow>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                {getIcon(card.iconName)}
              </div>

              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--dobato-pink)',
                  marginBottom: '0.5rem',
                }}
              >
                {card.title}
              </span>

              <p className="text-body-lg" style={{ color: 'var(--dobato-white)' }}>
                "{card.description}"
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
