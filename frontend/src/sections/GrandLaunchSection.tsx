import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { EVENT_DATE, EVENT_TITLE, EVENT_VENUE_NAME, EVENT_VENUE_LOCATION } from '../constants/brand';
import { EVENT_HIGHLIGHTS } from '../constants/event';
import { Calendar, Sparkles, Feather, Music, Heart, Trophy, ArrowRight, MapPin } from 'lucide-react';
import './sections.css';

export const GrandLaunchSection: React.FC = () => {
  const getHighlightIcon = (icon: string) => {
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
    <Section id="event" variant="plum" padding="lg">
      <Container size="xl">
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          <Badge variant="romantic" size="md" icon={<Sparkles size={14} />} style={{ marginBottom: '1.25rem' }}>
            Official Event Announcement
          </Badge>

          <Heading as="h2" fontFamily="sans" style={{ marginBottom: '0.75rem' }}>
            Something is <GradientText variant="romantic">about to begin.</GradientText>
          </Heading>

          <div
            style={{
              fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--dobato-white)',
              textTransform: 'uppercase',
              margin: '0.5rem 0',
            }}
          >
            {EVENT_TITLE}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 114, 182, 0.15)',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              color: 'var(--dobato-pink)',
              fontWeight: 700,
              fontSize: '1.1rem',
              margin: '1rem 0 0.85rem 0',
            }}
          >
            <Calendar size={18} />
            {EVENT_DATE}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <MapPin size={16} color="#F472B6" />
            <span>{EVENT_VENUE_NAME}, {EVENT_VENUE_LOCATION}</span>
          </div>

          <p className="text-body-lg" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            An evening of poetry, music, creativity and meaningful connections.
          </p>
        </div>

        {/* 4 Highlight Event Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3.5rem',
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
                {getHighlightIcon(item.icon)}
              </div>

              <Heading as="h4" fontFamily="sans" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                {item.title}
              </Heading>

              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: 'var(--dobato-pink)',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}
              >
                {item.subtitle}
              </span>

              <p className="text-body-sm">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link to="/register">
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Join the Launch
            </Button>
          </Link>

          <Link to="/event">
            <Button variant="outline" size="lg">
              View Event Details
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};
