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
import { Countdown } from '../components/common/Countdown/Countdown';
import { Accordion } from '../components/ui/Accordion/Accordion';
import { EventShareCard } from '../components/common/EventShareCard/EventShareCard';
import { VenueSection } from '../components/common/VenueSection/VenueSection';
import { EventExperienceSection } from '../components/common/EventExperienceSection/EventExperienceSection';
import { EVENT_DATE, EVENT_TITLE, BRAND_CAMPAIGN_LINE, EVENT_POETRY_THEME, EVENT_VENUE_NAME, EVENT_VENUE_FULL } from '../constants/brand';
import { EVENT_HIGHLIGHTS, PRIZES, EVENT_FAQ } from '../constants/event';
import { Calendar, Sparkles, Feather, Music, Heart, Trophy, ArrowRight, Radio, Volume2, Award, CheckCircle2, MapPin } from 'lucide-react';

export const EventPage: React.FC = () => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Feather':
        return <Feather size={24} color="#F472B6" />;
      case 'Music':
        return <Music size={24} color="#D946EF" />;
      case 'Heart':
        return <Heart size={24} color="#EC4899" fill="#EC4899" />;
      case 'Trophy':
        return <Trophy size={24} color="#A855F7" />;
      default:
        return <Sparkles size={24} color="#F472B6" />;
    }
  };

  return (
    <>
      <SEO
        title={`Dobatoo Grand Launch — 16 October 2026 • ${EVENT_VENUE_NAME}`}
        description={`Join the Dobatoo Grand Launch on 16 October 2026 at ${EVENT_VENUE_FULL} for an evening of poetry, music and meaningful connections.`}
      />

      {/* 1. Event Hero Section */}
      <Section variant="dark" padding="xl" style={{ paddingTop: 'clamp(5.5rem, 9vw, 9.5rem)', position: 'relative' }}>
        <Container size="xl">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
            <Badge variant="romantic" size="md" icon={<Sparkles size={14} />} style={{ marginBottom: '1.5rem' }}>
              DOBATOO GRAND LAUNCH • OPEN MIC
            </Badge>

            <Heading as="h1" fontFamily="sans" style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <GradientText variant="primary">{EVENT_TITLE}</GradientText>
            </Heading>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 2rem)',
                color: 'var(--dobato-pink)',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              "{BRAND_CAMPAIGN_LINE}"
            </h2>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 114, 182, 0.15)',
                border: '1px solid rgba(244, 114, 182, 0.3)',
                color: 'var(--dobato-white)',
                fontWeight: 700,
                fontSize: '1.15rem',
                marginBottom: '0.85rem',
              }}
            >
              <Calendar size={18} color="#F472B6" />
              {EVENT_DATE}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--dobato-pink)',
                fontWeight: 600,
                fontSize: '1.05rem',
                marginBottom: '1.75rem',
              }}
            >
              <MapPin size={18} />
              <span>{EVENT_VENUE_FULL}</span>
            </div>

            <p className="text-body-lg" style={{ marginBottom: '2.5rem', color: 'rgba(255, 255, 255, 0.88)' }}>
              An evening of poetry, music, creativity and meaningful connections.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Register for Free
                </Button>
              </Link>

              <Link to="/poetry">
                <Button variant="outline" size="lg" icon={<Feather size={18} />}>
                  Join Poetry Competition
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Countdown Component */}
          <Countdown />
        </Container>
      </Section>

      {/* 2. Event Story */}
      <Section variant="gradient" padding="lg">
        <Container size="md" style={{ textAlign: 'center' }}>
          <Heading as="h2" fontFamily="serif" style={{ marginBottom: '2rem' }}>
            One evening. <GradientText variant="romantic">Many stories.</GradientText>
          </Heading>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              fontSize: '1.2rem',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.88)',
              maxWidth: '660px',
              margin: '0 auto',
            }}
          >
            <p>Every person arrives with a different story.</p>
            <p style={{ color: 'var(--dobato-muted)' }}>
              Different paths. Different experiences. Different dreams.
            </p>
            <p>And sometimes those paths cross.</p>
            <p style={{ fontWeight: 600, color: 'var(--dobato-pink)' }}>
              <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span> brings that idea to life through an evening of poetry, music and connection.
            </p>
          </div>
        </Container>
      </Section>

      {/* 3. Event Highlights */}
      <Section variant="dark" padding="lg">
        <Container size="xl">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="primary" size="sm" style={{ marginBottom: '0.85rem' }}>
              Event Features
            </Badge>
            <Heading as="h2" fontFamily="sans">
              What Makes the <GradientText variant="primary">Launch Special</GradientText>
            </Heading>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {EVENT_HIGHLIGHTS.map((item) => (
              <Card key={item.id} variant="glass" hoverEffect>
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
                  {getIcon(item.icon)}
                </div>

                <Heading as="h4" fontFamily="sans" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                  {item.title}
                </Heading>

                <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  "{item.description}"
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Event Experience (3 Pillars: Poetry, Music, Connections) */}
      <EventExperienceSection />

      {/* 5. The Venue Section */}
      <VenueSection />

      {/* 6. Poetry Competition Preview */}
      <Section variant="gradient" padding="lg">
        <Container size="xl">
          <Card variant="glass" glow style={{ padding: '3.5rem 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <Badge variant="romantic" size="md" icon={<Feather size={14} />}>
                OPEN MIC • POETRY STAGE
              </Badge>
              <Badge variant="glass" size="md">
                FREE ENTRY
              </Badge>
            </div>

            <Heading as="h2" fontFamily="serif" style={{ marginBottom: '0.5rem' }}>
              Your story <GradientText variant="romantic">deserves a stage.</GradientText>
            </Heading>

            <div style={{ margin: '1.25rem 0 1.5rem 0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--dobato-pink)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                POETRY THEME
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  color: 'var(--dobato-white)',
                  fontWeight: 900,
                  marginTop: '0.2rem',
                }}
              >
                {EVENT_POETRY_THEME}
              </div>
            </div>

            <p className="text-body-lg" style={{ marginBottom: '2rem', maxWidth: '720px' }}>
              Turn your thoughts, feelings, and imagination into poetry and share them with a live audience during our open mic session.
            </p>

            {/* Performance Rules Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'rgba(217, 70, 239, 0.08)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(244, 114, 182, 0.2)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dobato-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>
                  ⏱ Performance Duration
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                  5 Minutes per Participant
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dobato-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>
                  🎭 Age Limit
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                  No Age Limit (All Ages Welcome)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span className="text-body-sm">
                Win trophies, cash prizes, and lifetime membership passes.
              </span>

              <Link to="/poetry">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  View Poetry Competition
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </Section>

      {/* 6. Music Section */}
      <Section variant="dark" padding="lg">
        <Container size="xl">
          <Card variant="glass" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(217, 70, 239, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: '#D946EF',
              }}
            >
              <Radio size={32} />
            </div>

            <Heading as="h2" fontFamily="serif" style={{ marginBottom: '1rem' }}>
              Music for <GradientText variant="romantic">the moment.</GradientText>
            </Heading>

            <p className="text-body-lg" style={{ maxWidth: '580px', margin: '0 auto 2rem auto' }}>
              Because some feelings are better expressed through music.
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
              Performers to be announced.
            </div>
          </Card>
        </Container>
      </Section>

      {/* 7. Prize Section */}
      <Section variant="plum" padding="lg">
        <Container size="xl">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="primary" size="sm" icon={<Trophy size={14} />} style={{ marginBottom: '1.25rem' }}>
              Prizes & Awards
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

                  <div style={{ fontSize: prize.isFeatured ? '2.5rem' : '2rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                    {prize.amount}
                  </div>
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

      {/* 8. Dedicated Date Callout Section */}
      <Section variant="gradient" padding="lg">
        <Container size="md">
          <Card variant="glass" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--dobato-pink)', marginBottom: '0.5rem' }}>
              16
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--dobato-white)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              OCTOBER 2026
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--dobato-muted)', marginBottom: '0.4rem' }}>
              DOBATOO GRAND LAUNCH
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--dobato-pink)', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <MapPin size={16} />
              <span>{EVENT_VENUE_FULL}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--dobato-white)', marginBottom: '2rem' }}>
              "Save the date."
            </h3>

            <Link to="/register">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                Register for Free
              </Button>
            </Link>
          </Card>
        </Container>
      </Section>

      {/* 9. FAQ Section */}
      <Section variant="dark" padding="lg">
        <Container size="lg">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="primary" size="sm" style={{ marginBottom: '0.85rem' }}>
              Got Questions?
            </Badge>
            <Heading as="h2" fontFamily="sans">
              Frequently Asked <GradientText variant="primary">Questions</GradientText>
            </Heading>
          </div>
          <Accordion items={EVENT_FAQ} />

          {/* Event Share Card */}
          <div style={{ marginTop: '3.5rem' }}>
            <EventShareCard />
          </div>
        </Container>
      </Section>

      {/* 10. Final Registration CTA */}
      <Section variant="plum" padding="xl">
        <Container size="md" style={{ textAlign: 'center' }}>
          <Heading as="h2" fontFamily="serif" style={{ marginBottom: '1rem' }}>
            Be There When <GradientText variant="primary">Paths Cross.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginBottom: '2.5rem' }}>
            Join young Nepalis for an unforgettable launch evening of poetry, music and real connections.
          </p>

          <Link to="/register">
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Register Now →
            </Button>
          </Link>
        </Container>
      </Section>
    </>
  );
};
