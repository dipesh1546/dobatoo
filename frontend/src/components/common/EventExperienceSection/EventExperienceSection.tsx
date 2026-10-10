import React, { useState } from 'react';
import { Section } from '../../ui/Section/Section';
import { Container } from '../../ui/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { GradientText } from '../../ui/GradientText/GradientText';
import { Badge } from '../../ui/Badge/Badge';
import { Sparkles, Feather, Music, Heart } from 'lucide-react';
import './EventExperienceSection.css';

interface ExperienceItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  icon: typeof Feather;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    number: '01',
    title: 'POETRY',
    tagline: 'Finding the Right Person',
    description: 'Original poetry and heartfelt recitals expressing the journey of finding someone who understands you and connects with you.',
    image: '/images/event/poetry-performance.jpg',
    icon: Feather,
  },
  {
    number: '02',
    title: 'MUSIC',
    tagline: 'Acoustic Vibrations',
    description: 'Soul-stirring live acoustic performances and gentle melodies designed around intimacy and deep listening.',
    image: '/images/event/music-performance.jpg',
    icon: Music,
  },
  {
    number: '03',
    title: 'CONNECTIONS',
    tagline: 'Meaningful Encounters',
    description: 'Curated social icebreakers and natural conversations where attendees from different paths meet and share their stories.',
    image: '/images/event/connections.jpg',
    icon: Heart,
  },
];

export const EventExperienceSection: React.FC = () => {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  return (
    <Section id="experience" variant="plum" padding="xl" className="experience-section">
      <Container size="xl">
        <div className="experience-header">
          <Badge variant="romantic" size="md" icon={<Sparkles size={14} />}>
            THE DOBATOO EXPERIENCE
          </Badge>

          <Heading as="h2" fontFamily="serif" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            What to <GradientText variant="romantic">Expect</GradientText>
          </Heading>

          <p className="text-body-lg experience-subtitle">
            An evening crafted around three harmonious pillars that bring people together.
          </p>
        </div>

        <div className="experience-grid">
          {EXPERIENCES.map((item) => {
            const Icon = item.icon;
            const isLoaded = Boolean(loadedMap[item.number]);

            return (
              <div key={item.number} className="experience-card">
                <div className="experience-image-wrapper">
                  <img
                    src={item.image}
                    alt={`${item.title} — Dobatoo Grand Launch`}
                    className={`experience-image ${isLoaded ? 'experience-image-loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => setLoadedMap((prev) => ({ ...prev, [item.number]: true }))}
                  />
                  <div className="experience-image-overlay" />
                  <div className="experience-number-badge">{item.number}</div>
                  <div className="experience-icon-badge">
                    <Icon size={18} color="#F472B6" />
                  </div>
                </div>

                <div className="experience-card-body">
                  <div className="experience-card-meta">
                    <span className="experience-tagline">{item.tagline}</span>
                  </div>

                  <h3 className="experience-card-title">{item.title}</h3>

                  <p className="experience-card-description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
