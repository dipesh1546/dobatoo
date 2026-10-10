import React from 'react';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { LayoutDashboard, Lock } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Admin Portal | Dobatoo"
        description="Dobatoo Admin Dashboard Foundation — Future Management Portal."
      />

      <Section variant="dark" padding="xl" style={{ paddingTop: '9rem' }}>
        <Container size="lg">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="outline" size="md" icon={<LayoutDashboard size={14} />} style={{ marginBottom: '1.25rem' }}>
              Phase 1 Route Foundation — /admin
            </Badge>
            <Heading as="h1" fontFamily="sans">
              Dobatoo <GradientText variant="primary">Admin Portal Structure</GradientText>
            </Heading>
            <p className="text-body-lg" style={{ marginTop: '1rem' }}>
              Route placeholder reserved for future Phase admin control dashboard.
            </p>
          </div>

          <Card variant="glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: '#A855F7',
              }}
            >
              <Lock size={28} />
            </div>

            <Heading as="h3">Admin Dashboard Reserved</Heading>
            <p className="text-body" style={{ maxWidth: '520px', margin: '1rem auto 0 auto' }}>
              In accordance with Phase 1 constraints, the admin dashboard UI and management APIs will be developed in future phases.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
};
