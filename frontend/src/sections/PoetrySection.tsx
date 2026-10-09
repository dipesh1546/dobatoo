import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { EVENT_POETRY_THEME } from '../constants/brand';
import { Feather, ArrowRight } from 'lucide-react';
import './sections.css';

export const PoetrySection: React.FC = () => {
  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <Card variant="glass" glow style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="poetry-section-grid">
              <div className="poetry-section-content">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Badge variant="romantic" size="md" icon={<Feather size={14} />}>
                    OPEN MIC • Poetry & Performance
                  </Badge>

                  <Badge variant="glass" size="md">
                    FREE ENTRY
                  </Badge>
                </div>

                <Heading as="h2" fontFamily="serif" style={{ marginBottom: '0.5rem' }}>
                  Turn your story <GradientText variant="romantic">into poetry.</GradientText>
                </Heading>

                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dobato-pink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    POETRY THEME
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      color: 'var(--dobato-white)',
                      fontWeight: 800,
                      marginTop: '0.2rem',
                    }}
                  >
                    {EVENT_POETRY_THEME}
                  </div>
                </div>

                <p className="text-body" style={{ marginBottom: '1.75rem', lineHeight: '1.6' }}>
                  Write about finding someone who understands you, connects with you, and shares meaningful companionship as two paths meet at the right point.
                </p>

                {/* Prize Teaser Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(244, 114, 182, 0.15)',
                    marginBottom: '2rem',
                  }}
                >
                  <div>
                    <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>🥇 1st Prize</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dobato-pink)' }}>
                      NPR 3,000
                    </div>
                  </div>

                  <div>
                    <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>🥈 2nd Prize</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F0ABFC' }}>
                      NPR 2,000
                    </div>
                  </div>

                  <div>
                    <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>🥉 3rd Prize</span>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                      3 Mos Free Access
                    </div>
                  </div>
                </div>

                {/* Duration & Age Limit Badge Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--dobato-pink)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span>⏱ 5 Minutes per Participant</span>
                  <span>•</span>
                  <span>🎭 No Age Limit</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <Link to="/poetry">
                    <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                      Join Poetry Competition
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Poetry Performance Image Card */}
              <div className="poetry-section-visual">
                <div className="poetry-image-card">
                  <img
                    src="/images/competition/poetry-performance.jpg"
                    alt="DOBATO Poetry Performance Stage"
                    className="poetry-section-img"
                    loading="lazy"
                  />
                  <div className="poetry-image-overlay" />
                  <div className="poetry-image-badge">
                    <Feather size={14} color="#F472B6" />
                    <span>Live Stage Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};
