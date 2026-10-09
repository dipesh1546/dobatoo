import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { Button } from '../components/ui/Button/Button';
import { Badge } from '../components/ui/Badge/Badge';
import { EVENT_DATE } from '../constants/brand';
import { Heart, Sparkles, ArrowRight, Compass } from 'lucide-react';
import './sections.css';

export const DEFAULT_HEADLINES = [
  "Where Paths Cross, Hearts Connect.",
  "Dobato मा आऊ, कोही आफ्नो पाऊ।",
  "Raaste Se Rishton Tak.",
];

export const HeroSection: React.FC = () => {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      const timeout = setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % DEFAULT_HEADLINES.length);
        setIsFading(false);
      }, 350);
      return () => clearTimeout(timeout);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-glow" />

      <Container size="xl">
        <div className="hero-grid-layout">
          {/* Left Text Composition */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <Badge variant="romantic" size="md" icon={<Heart size={14} fill="#EC4899" color="#EC4899" />}>
                Real people. Genuine connections.
              </Badge>
              
              <Badge variant="glass" size="md" icon={<Sparkles size={14} color="#F472B6" />}>
                GRAND LAUNCH • {EVENT_DATE}
              </Badge>
            </div>

            <Heading
              as="h1"
              fontFamily="serif"
              style={{
                marginBottom: '1.25rem',
                minHeight: 'clamp(3.2rem, 7vw, 4.8rem)',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                opacity: isFading ? 0 : 1,
                transform: isFading ? 'translateY(4px)' : 'translateY(0)',
              }}
              aria-live="polite"
            >
              <span>{DEFAULT_HEADLINES[headlineIndex]}</span>
            </Heading>

            <p
              className="text-body-lg"
              style={{
                fontSize: '1.25rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '560px',
              }}
            >
              DOBATO is a new Nepali platform created for meaningful connections, genuine conversations and stories that begin when two paths meet.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '2.5rem',
              }}
            >
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Register for Free
                </Button>
              </Link>

              <a href="#intro">
                <Button variant="outline" size="lg" icon={<Compass size={18} />}>
                  Explore DOBATO
                </Button>
              </a>
            </div>

            <p className="text-body-sm" style={{ opacity: 0.7 }}>
              Registration is completely free • Nepali connection platform
            </p>
          </div>

          {/* Right Visual Composition: Editorial Event Image + Overlaid Brand Emblem */}
          <div className="hero-visual-frame">
            <div className="hero-image-card">
              <img
                src="/images/event/hero.jpg"
                alt="DOBATO community gathering and authentic meaningful connections"
                className="hero-backdrop-img"
                loading="eager"
              />
              <div className="hero-backdrop-overlay" />

              {/* Overlaid Brand Path Emblem */}
              <div className="hero-brand-overlay">
                <img
                  src="/favicon.png"
                  alt="DOBATO Emblem"
                  width={34}
                  height={34}
                  className="hero-brand-emblem"
                  style={{ borderRadius: '8px', objectFit: 'contain' }}
                />
                <span className="hero-brand-caption">Two Paths. One Connection.</span>
              </div>

              {/* Floating Event Tag */}
              <div className="hero-floating-badge">
                <Sparkles size={14} color="#F472B6" />
                <span>The Gardens • Panipokhari, Kathmandu</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
