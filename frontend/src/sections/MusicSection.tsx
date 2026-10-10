import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Music, Radio, Volume2 } from 'lucide-react';
import './sections.css';

export const MusicSection: React.FC = () => {
  return (
    <Section variant="plum" padding="lg">
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <Badge variant="romantic" size="sm" icon={<Music size={14} />} style={{ marginBottom: '1.25rem' }}>
            Live Performances & Atmosphere
          </Badge>

          <Heading as="h2" fontFamily="serif">
            When words aren't enough, <GradientText variant="romantic">music speaks.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginTop: '1rem' }}>
            Experience live music, acoustic performances and an intimate evening created around genuine connection.
          </p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Card variant="glass" style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="music-section-grid">
              {/* Left: Music Performance Imagery */}
              <div className="music-image-card">
                <img
                  src="/images/event/music-performance.jpg"
                  alt="Dobatoo Live Acoustic Music Performance"
                  className="music-section-img"
                  loading="lazy"
                />
                <div className="music-image-overlay" />
                <div className="music-image-badge">
                  <Music size={14} color="#D946EF" />
                  <span>Acoustic & Live Sets</span>
                </div>
              </div>

              {/* Right: Music Details */}
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(217, 70, 239, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    color: '#D946EF',
                  }}
                >
                  <Radio size={26} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--dobato-white)', marginBottom: '0.75rem' }}>
                  Live Musical Lineup
                </h3>

                <p className="text-body" style={{ margin: '0 0 1.75rem 0', lineHeight: '1.65' }}>
                  We are curating acoustic artists and local performers to set the backdrop for the Dobatoo Grand Launch. An intimate setting where melody and story intertwine.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--dobato-pink)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  <Volume2 size={16} />
                  Live performances to be announced.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};
