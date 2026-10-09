import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner/LoadingSpinner';
import { verificationService } from '../services/verificationService';
import type { VerificationResponseData } from '../types/api';
import { EVENT_DATE } from '../constants/brand';
import { CheckCircle2, XCircle, ShieldCheck, Home } from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setErrorMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await verificationService.verifyRegistrationToken(token);

        if (response.success && response.data) {
          setVerificationResult(response.data);
        } else {
          setErrorMessage(response.message || 'Invalid or expired event pass.');
        }
      } catch (err) {
        setErrorMessage("We couldn't connect to DOBATO. Please check your internet connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <>
      <SEO
        title="Event Verification — DOBATO"
        description="DOBATO Registration Pass Verification."
      />

      {/* Prevent search indexing for verification page */}
      <meta name="robots" content="noindex, nofollow" />

      <Section variant="dark" padding="xl" style={{ paddingTop: 'clamp(5.5rem, 9vw, 9.5rem)' }}>
        <Container size="md" style={{ textAlign: 'center' }}>
          <Badge variant="romantic" size="md" icon={<ShieldCheck size={14} />} style={{ marginBottom: '1.5rem' }}>
            REGISTRATION VERIFICATION
          </Badge>

          <Heading as="h1" fontFamily="serif" style={{ marginBottom: '0.75rem' }}>
            Registration <GradientText variant="primary">Verification</GradientText>
          </Heading>

          <p className="text-body" style={{ marginBottom: '2.5rem' }}>
            DOBATO Grand Launch • {EVENT_DATE}
          </p>

          <div style={{ maxWidth: '540px', margin: '0 auto' }}>
            {isLoading ? (
              <Card variant="glass" style={{ padding: '3rem 2rem' }}>
                <LoadingSpinner size="lg" label="Verifying event pass token..." />
              </Card>
            ) : errorMessage ? (
              /* Invalid Pass / Network Error Card */
              <Card variant="glass" style={{ padding: '3rem 2rem', border: '1px solid #EF4444' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: '#EF4444',
                  }}
                >
                  <XCircle size={36} />
                </div>

                <Heading as="h3" style={{ color: '#F87171', marginBottom: '1rem' }}>
                  {errorMessage}
                </Heading>

                <p className="text-body-sm" style={{ marginBottom: '2rem' }}>
                  The provided QR code or token could not be verified. Please ensure you have a valid DOBATO event pass.
                </p>

                <Link to="/">
                  <Button variant="outline" size="md" icon={<Home size={16} />}>
                    Return to DOBATO
                  </Button>
                </Link>
              </Card>
            ) : verificationResult?.isAlreadyCheckedIn ? (
              /* Already Confirmed Card */
              <Card variant="glass" style={{ padding: '3rem 2rem', border: '1px solid #10B981' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: '#10B981',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <Heading as="h3" style={{ color: '#34D399', marginBottom: '0.75rem' }}>
                  Registration Confirmed
                </Heading>

                {verificationResult.registrationId && (
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dobato-white)', margin: '1rem 0' }}>
                    {verificationResult.registrationId}
                  </div>
                )}

                <p className="text-body-sm" style={{ marginBottom: '2rem' }}>
                  This registration pass is verified and active for the DOBATO Grand Launch.
                </p>

                <Link to="/">
                  <Button variant="outline" size="md" icon={<Home size={16} />}>
                    Return to DOBATO
                  </Button>
                </Link>
              </Card>
            ) : (
              /* Registration Valid Card */
              <Card variant="glass" glow style={{ padding: '3.5rem 2rem', border: '2px solid var(--dobato-pink)' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(244, 114, 182, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: '#F472B6',
                  }}
                >
                  <CheckCircle2 size={40} />
                </div>

                <Badge variant="romantic" size="md" style={{ marginBottom: '1rem' }}>
                  REGISTRATION VALID
                </Badge>

                <div
                  style={{
                    fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.5rem)',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--dobato-white)',
                    margin: '1rem 0 0.5rem 0',
                  }}
                >
                  {verificationResult?.registrationId || 'DBT-2026-VALID'}
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--dobato-pink)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    margin: '1rem 0 2rem 0',
                  }}
                >
                  Attendance Type: {verificationResult?.participationType === 'ATTEND_AND_POETRY' ? 'Event + Poetry' : 'Event'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Link to="/">
                    <Button variant="primary" size="md" icon={<Home size={16} />}>
                      Return to DOBATO
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
};
