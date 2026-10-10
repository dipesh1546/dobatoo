import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Button } from '../components/ui/Button/Button';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Page Not Found — Dobatoo"
        description="Looks like this path doesn't lead anywhere. Return to Dobatoo to explore poetry, music, and meaningful connections."
      />

      <Section variant="dark" padding="xl" style={{ paddingTop: '10rem', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container size="md" style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 'clamp(4rem, 8vw, 7rem)',
              fontWeight: 800,
              lineHeight: 1,
              background: 'var(--gradient-primary, linear-gradient(135deg, #F472B6 0%, #A855F7 100%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontFamily: 'var(--font-serif)',
            }}
          >
            404
          </div>

          <Heading as="h1" fontFamily="serif" style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
            Looks like this path <GradientText variant="romantic">doesn't lead anywhere.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2.5rem', maxWidth: '540px', margin: '0 auto 2.5rem auto' }}>
            The page you are looking for does not exist or may have been moved. Let's find your way back.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/">
              <Button variant="primary" size="lg" icon={<Home size={18} />}>
                Go Home
              </Button>
            </Link>

            <Link to="/event">
              <Button variant="outline" size="lg" icon={<Compass size={18} />}>
                Explore Dobatoo
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
};
