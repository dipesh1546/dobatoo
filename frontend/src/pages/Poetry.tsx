import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { EventShareCard } from '../components/common/EventShareCard/EventShareCard';
import { EVENT_POETRY_THEME } from '../constants/brand';
import { PRIZES } from '../constants/event';
import { Feather, CheckCircle2, Award, ArrowRight, HelpCircle } from 'lucide-react';
import { PerformanceDetailsCard } from '../components/common/PerformanceDetailsCard/PerformanceDetailsCard';
import './Poetry.css';

export const PoetryPage: React.FC = () => {
  const confirmedRules = [
    'Poetry must be original work by the participant.',
    `The performance should relate to the official Dobatoo theme: "${EVENT_POETRY_THEME}".`,
    'Performance Duration: 5 minutes per participant.',
    'No Age Limit: Participants of all ages are welcome to perform.',
    'Respectful and appropriate content is required.',
    'Participants must complete free event registration.',
    'Participants should be present at the event to perform.',
  ];

  const evaluationCategories = [
    { name: 'Originality', status: 'To be announced' },
    { name: 'Expression', status: 'To be announced' },
    { name: 'Theme Interpretation', status: 'To be announced' },
    { name: 'Performance', status: 'To be announced' },
  ];

  return (
    <>
      <SEO
        title={`Dobatoo Open Mic & Poetry — Theme: ${EVENT_POETRY_THEME}`}
        description={`Join the Dobatoo Open Mic & Poetry Competition. Theme: ${EVENT_POETRY_THEME}. Registration is free.`}
      />

      {/* 1. Poetry Hero Section */}
      <Section variant="dark" padding="xl" style={{ paddingTop: 'clamp(5.5rem, 9vw, 9.5rem)' }}>
        <Container size="xl">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
            <Badge variant="romantic" size="md" icon={<Feather size={14} />} style={{ marginBottom: '1.5rem' }}>
              OPEN MIC • POETRY COMPETITION
            </Badge>

            <Heading as="h1" fontFamily="serif" style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.25rem)', marginBottom: '0.75rem' }}>
              Turn Your Story <GradientText variant="romantic">Into Poetry.</GradientText>
            </Heading>

            <div style={{ margin: '1.25rem 0 1.5rem 0' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--dobato-pink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                POETRY THEME
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  color: 'var(--dobato-white)',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  marginTop: '0.25rem',
                }}
              >
                {EVENT_POETRY_THEME}
              </div>
            </div>

            <p className="text-body-lg" style={{ marginBottom: '2.5rem', color: 'rgba(255, 255, 255, 0.88)' }}>
              Two paths meeting at the right point. Share your original performances on finding someone who understands you and connects with you.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Register for Poetry →
                </Button>
              </Link>
            </div>

            <p className="text-body-sm" style={{ opacity: 0.7 }}>
              Registration is 100% free • Open to all writers in Nepal
            </p>
          </div>
        </Container>
      </Section>

      {/* Visual Stage & Audience Showcase */}
      <Section variant="dark" padding="md" style={{ paddingTop: 0 }}>
        <Container size="xl">
          <div className="poetry-gallery-grid">
            <div className="poetry-gallery-featured">
              <img
                src="/images/competition/poetry-performance.jpg"
                alt="Poetry Recital on Dobatoo Stage"
                className="poetry-gallery-img"
                loading="lazy"
              />
              <div className="poetry-gallery-overlay" />
              <div className="poetry-gallery-badge">
                <Feather size={16} color="#F472B6" />
                <span>The Stage • Expressive Recital</span>
              </div>
            </div>

            <div className="poetry-gallery-supporting">
              <div className="poetry-gallery-card">
                <img
                  src="/images/competition/stage-performance.jpg"
                  alt="Acoustic live music and stage performance"
                  className="poetry-gallery-img"
                  loading="lazy"
                />
                <div className="poetry-gallery-overlay" />
                <div className="poetry-gallery-subbadge">
                  <span>Acoustic Stage Atmosphere</span>
                </div>
              </div>

              <div className="poetry-gallery-card">
                <img
                  src="/images/competition/audience.jpg"
                  alt="Attentive Nepali community audience listening to poetry"
                  className="poetry-gallery-img"
                  loading="lazy"
                />
                <div className="poetry-gallery-overlay" />
                <div className="poetry-gallery-subbadge">
                  <span>Attentive & Warm Community</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. About the Competition */}
      <Section variant="gradient" padding="lg">
        <Container size="lg">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="primary" size="sm" style={{ marginBottom: '0.85rem' }}>
              Overview
            </Badge>
            <Heading as="h2" fontFamily="sans">
              About the <GradientText variant="primary">Competition</GradientText>
            </Heading>
          </div>

          <Card variant="glass" glow style={{ padding: '3rem 2.5rem' }}>
            <p className="text-body-lg" style={{ marginBottom: '1.75rem', lineHeight: '1.7' }}>
              The <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span> Competition invites participants to express their journey of finding the right person — finding someone who understands you, connects with you, and shares meaningful companionship.
            </p>

            {/* Unfinalized details clearly marked */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(244, 114, 182, 0.15)',
              }}
            >
              <div>
                <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>Entry Fee</span>
                <div style={{ fontWeight: 700, color: 'var(--dobato-pink)', fontSize: '1.1rem' }}>FREE</div>
              </div>

              <div>
                <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>Performance Duration</span>
                <div style={{ fontWeight: 700, color: 'var(--dobato-white)' }}>5 Minutes per Participant</div>
              </div>

              <div>
                <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>Participant Age Limit</span>
                <div style={{ fontWeight: 700, color: 'var(--dobato-white)' }}>No Age Limit</div>
              </div>

              <div>
                <span className="text-caption" style={{ color: 'var(--dobato-muted)' }}>Venue Location</span>
                <div style={{ fontWeight: 600, color: 'var(--dobato-white)' }}>The Gardens, Panipokhari, Kathmandu, Nepal</div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* 2b. Official Performance Details Section */}
      <Section variant="plum" padding="lg">
        <Container size="md">
          <PerformanceDetailsCard />
        </Container>
      </Section>

      {/* 3. Competition Guidelines / Rules */}
      <Section variant="dark" padding="lg">
        <Container size="lg">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="romantic" size="sm" style={{ marginBottom: '0.85rem' }}>
              Guidelines
            </Badge>
            <Heading as="h2" fontFamily="serif">
              Competition <GradientText variant="romantic">Guidelines</GradientText>
            </Heading>
          </div>

          <Card variant="glass" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {confirmedRules.map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <CheckCircle2 size={20} color="#F472B6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span className="text-body-lg" style={{ color: 'var(--dobato-white)' }}>{rule}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                color: 'var(--dobato-muted)',
                fontStyle: 'italic',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <HelpCircle size={16} color="#EC4899" />
              Final event guidelines will be shared with registered participants.
            </div>
          </Card>
        </Container>
      </Section>

      {/* 4. Prize Section */}
      <Section variant="plum" padding="lg">
        <Container size="xl">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="primary" size="sm" icon={<Award size={14} />} style={{ marginBottom: '1.25rem' }}>
              Rewards
            </Badge>

            <Heading as="h2" fontFamily="sans">
              Write. Perform. <GradientText variant="primary">Win.</GradientText>
            </Heading>
          </div>

          <div className="prize-grid">
            {PRIZES.map((prize) => (
              <Card
                key={prize.rank}
                variant={prize.isFeatured ? 'elevated' : 'glass'}
                className={prize.isFeatured ? 'prize-card-featured' : ''}
                glow={prize.isFeatured}
              >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <Badge variant={prize.isFeatured ? 'romantic' : 'outline'} size="sm" style={{ marginBottom: '1rem' }}>
                    {prize.badge}
                  </Badge>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', color: prize.isFeatured ? 'var(--dobato-pink)' : 'var(--dobato-muted)', marginBottom: '0.25rem' }}>
                    {prize.rank}
                  </div>

                  {prize.amount ? (
                    <div style={{ fontSize: prize.isFeatured ? '2.5rem' : '2rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                      {prize.amount}
                    </div>
                  ) : (
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dobato-pink)', marginTop: '0.5rem' }}>
                      {prize.access}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {prize.trophy && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                      <Award size={18} color="#F472B6" />
                      <span>Dobatoo Official Trophy</span>
                    </div>
                  )}

                  {prize.tshirt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} color="#EC4899" />
                      <span>Dobatoo Official T-Shirt</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#D946EF" />
                    <span>{prize.access}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Judging / Evaluation Categories */}
      <Section variant="dark" padding="lg">
        <Container size="lg">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="glass" size="sm" style={{ marginBottom: '0.85rem' }}>
              Evaluation Structure
            </Badge>

            <Heading as="h2" fontFamily="serif">
              How will performances <GradientText variant="romantic">be evaluated?</GradientText>
            </Heading>

            <p className="text-body" style={{ marginTop: '0.75rem', color: 'var(--dobato-pink)' }}>
              Evaluation criteria to be finalized.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {evaluationCategories.map((cat) => (
              <Card key={cat.name} variant="glass" style={{ textAlign: 'center', padding: '1.75rem 1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dobato-white)', marginBottom: '0.5rem' }}>
                  {cat.name}
                </h3>
                <span className="text-body-sm" style={{ color: 'var(--dobato-muted)', fontStyle: 'italic' }}>
                  {cat.status}
                </span>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Social Share & Final CTA */}
      <Section variant="plum" padding="xl">
        <Container size="md" style={{ textAlign: 'center' }}>
          <EventShareCard />

          <div style={{ marginTop: '3rem' }}>
            <Heading as="h2" fontFamily="serif" style={{ marginBottom: '1rem' }}>
              Your Verse <GradientText variant="primary">Begins Here.</GradientText>
            </Heading>

            <p className="text-body-lg" style={{ marginBottom: '2.5rem' }}>
              Reserve your spot for the Dobatoo Poetry Competition today.
            </p>

            <Link to="/register">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                Register for Poetry Competition →
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
};
