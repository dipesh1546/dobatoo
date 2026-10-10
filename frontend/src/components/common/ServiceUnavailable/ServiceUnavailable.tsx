import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Section } from '../../ui/Section/Section';
import { Container } from '../../ui/Container/Container';
import { Button } from '../../ui/Button/Button';
import { Heading } from '../../ui/Heading/Heading';

interface ServiceUnavailableProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export const ServiceUnavailable: React.FC<ServiceUnavailableProps> = ({
  onRetry = () => window.location.reload(),
  title = 'Dobatoo is temporarily unavailable.',
  message = 'We are performing scheduled maintenance or updating servers. Please try again shortly.',
}) => {
  return (
    <Section variant="dark" padding="xl" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container size="sm" style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(244, 114, 182, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: '#F472B6',
          }}
        >
          <AlertCircle size={36} />
        </div>

        <Heading as="h1" fontFamily="serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>
          {title}
        </Heading>

        <p className="text-body-lg" style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>
          {message}
        </p>

        <Button variant="primary" size="lg" icon={<RefreshCw size={18} />} onClick={onRetry}>
          Try Again
        </Button>
      </Container>
    </Section>
  );
};
