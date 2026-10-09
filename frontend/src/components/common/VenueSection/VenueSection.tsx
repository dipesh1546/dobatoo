import React, { useState } from 'react';
import { Section } from '../../ui/Section/Section';
import { Container } from '../../ui/Container/Container';
import { Heading } from '../../ui/Heading/Heading';
import { GradientText } from '../../ui/GradientText/GradientText';
import { Badge } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { EVENT_VENUE_NAME, EVENT_VENUE_LOCATION, EVENT_MAP_URL, EVENT_DATE } from '../../../constants/brand';
import { MapPin, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import './VenueSection.css';

interface VenueSectionProps {
  id?: string;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ id = 'venue' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Section id={id} variant="dark" padding="xl" className="venue-section">
      <Container size="xl">
        <div className="venue-two-col-grid">
          {/* Left / Top on mobile: Dedicated Venue Image */}
          <div className="venue-visual-col">
            <div className="venue-image-card">
              {!imageError ? (
                <div className="venue-image-wrapper">
                  <img
                    src="/images/event/venue.jpg"
                    alt="DOBATO Grand Launch venue at The Gardens, Panipokhari, Kathmandu"
                    className={`venue-img ${imageLoaded ? 'venue-img-loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                  <div className="venue-img-overlay" />
                  <div className="venue-floating-badge">
                    <Sparkles size={14} color="#F472B6" />
                    <span>Official Launch Venue</span>
                  </div>
                </div>
              ) : (
                <div className="venue-fallback-card">
                  <MapPin size={48} color="#F472B6" />
                  <h3>{EVENT_VENUE_NAME}</h3>
                  <p>{EVENT_VENUE_LOCATION}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right / Bottom on mobile: Venue Content & Information */}
          <div className="venue-content-col">
            <Badge variant="romantic" size="md" icon={<MapPin size={14} />} className="venue-badge">
              THE VENUE
            </Badge>

            <Heading as="h2" fontFamily="serif" className="venue-title">
              <GradientText variant="primary">{EVENT_VENUE_NAME}</GradientText>
            </Heading>

            <div className="venue-address-row">
              <MapPin size={20} color="#F472B6" className="venue-pin-icon" />
              <span className="venue-address-text">{EVENT_VENUE_LOCATION}</span>
            </div>

            <p className="text-body-lg venue-description-text">
              A welcoming space where paths cross, stories begin, and meaningful connections are made.
            </p>

            <div className="venue-date-row">
              <Calendar size={16} color="#F472B6" />
              <span>DOBATO Grand Launch • {EVENT_DATE}</span>
            </div>

            <div className="venue-cta-wrap">
              <a
                href={EVENT_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-map-link"
                aria-label={`Open Google Maps for ${EVENT_VENUE_NAME}, ${EVENT_VENUE_LOCATION}`}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ExternalLink size={18} />}
                  iconPosition="right"
                  className="venue-map-btn"
                >
                  View Location
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
