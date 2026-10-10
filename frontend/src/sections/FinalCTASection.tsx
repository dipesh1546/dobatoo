import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { EVENT_DATE } from '../constants/brand';
import { Calendar, ArrowRight, Compass, Heart } from 'lucide-react';
import './sections.css';

export const FinalCTASection: React.FC = () => {
  return (
    <Section variant="dark" padding="xl">
      <Container size="lg">
        <Card variant="glass" glow style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(244, 114, 182, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: '#F472B6',
            }}
          >
            <Heart size={32} fill="#F472B6" />
          </div>

          <Heading as="h2" fontFamily="serif" style={{ marginBottom: '0.75rem' }}>
            Maybe your paths were <GradientText variant="primary">meant to cross.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Be there when <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span> begins.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--dobato-pink)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              marginBottom: '2.5rem',
            }}
          >
            <Calendar size={22} />
            {EVENT_DATE}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            <Link to="/register">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                Register for Free
              </Button>
            </Link>

            <a href="#about">
              <Button variant="outline" size="lg" icon={<Compass size={18} />}>
                Explore Dobatoo
              </Button>
            </a>
          </div>

          <p className="text-body-sm" style={{ opacity: 0.7 }}>
            Registration is completely free.
          </p>
        </Card>
      </Container>
    </Section>
  );
};
