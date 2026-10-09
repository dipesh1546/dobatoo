import React from 'react';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { PRIZES } from '../constants/event';
import { Trophy, CheckCircle2, Award } from 'lucide-react';
import './sections.css';

export const PrizeTeaserSection: React.FC = () => {
  return (
    <Section variant="dark" padding="lg">
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
          <Badge variant="primary" size="sm" icon={<Trophy size={14} />} style={{ marginBottom: '1.25rem' }}>
            Competition Rewards
          </Badge>

          <Heading as="h2" fontFamily="sans">
            Create. Perform. Connect. <GradientText variant="primary">Win.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginTop: '1rem' }}>
            Celebrate your creativity with official DOBATO trophies, cash awards, and exclusive membership perks.
          </p>
        </div>

        {/* 3 Prize Cards */}
        <div className="prize-grid">
          {PRIZES.map((prize) => {
            const isFeatured = prize.isFeatured;

            return (
              <Card
                key={prize.rank}
                variant={isFeatured ? 'elevated' : 'glass'}
                className={isFeatured ? 'prize-card-featured' : ''}
                glow={isFeatured}
              >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <Badge variant={isFeatured ? 'romantic' : 'outline'} size="sm" style={{ marginBottom: '1rem' }}>
                    {prize.badge}
                  </Badge>

                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: isFeatured ? 'var(--dobato-pink)' : 'var(--dobato-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {prize.rank}
                  </div>

                  {prize.amount ? (
                    <div
                      style={{
                        fontSize: isFeatured ? '2.5rem' : '2rem',
                        fontWeight: 800,
                        color: 'var(--dobato-white)',
                      }}
                    >
                      {prize.amount}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--dobato-pink)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {prize.access}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {prize.trophy && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                      <Award size={18} color="#F472B6" />
                      <span>DOBATO Official Trophy</span>
                    </div>
                  )}

                  {prize.tshirt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} color="#EC4899" />
                      <span>DOBATO Official T-Shirt</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#D946EF" />
                    <span>{prize.access}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
