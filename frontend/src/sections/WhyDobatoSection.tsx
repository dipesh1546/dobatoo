import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { WHY_DOBATO_POINTS } from '../constants/event';
import { Sparkles, BookOpen, Compass, Flame } from 'lucide-react';
import './sections.css';

export const WhyDobatoSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles size={24} color="#F472B6" />;
      case 'BookOpen':
        return <BookOpen size={24} color="#D946EF" />;
      case 'Compass':
        return <Compass size={24} color="#A855F7" />;
      case 'Flame':
        return <Flame size={24} color="#EC4899" />;
      default:
        return <Sparkles size={24} color="#F472B6" />;
    }
  };

  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
          <Heading as="h2" fontFamily="serif">
            More than <GradientText variant="romantic">a swipe.</GradientText>
          </Heading>
          <p className="text-body-lg" style={{ marginTop: '1rem' }}>
            DOBATO is built around shared culture, authentic moments, and stories that matter.
          </p>
        </div>

        <div className="features-grid-4">
          {WHY_DOBATO_POINTS.map((pt) => (
            <Card key={pt.title} variant="glass" hoverEffect>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                {getIcon(pt.iconName)}
              </div>

              <Heading as="h4" fontFamily="sans" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                {pt.title}
              </Heading>

              <p className="text-body-sm">"{pt.description}"</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
