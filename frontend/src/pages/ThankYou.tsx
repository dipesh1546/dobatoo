import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { EventPass } from '../components/common/EventPass/EventPass';
import { EventShareCard } from '../components/common/EventShareCard/EventShareCard';
import { EVENT_DATE, EVENT_VENUE_FULL, EVENT_POETRY_THEME } from '../constants/brand';
import {
  CheckCircle2,
  Calendar,
  Home,
  Sparkles,
  Mail,
  AlertTriangle,
  Heart,
  Share2,
  Copy,
  Check,
  Award,
  MapPin,
} from 'lucide-react';
import { referralService } from '../services/referralService';

interface ConfirmationLocationState {
  registrationId?: string;
  verificationToken?: string;
  emailSent?: boolean | null;
  fullName?: string;
  email?: string;
  participationType?: string;
  performanceType?: string;
  stageIntroductionName?: string;
  wasReferred?: boolean;
}

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as ConfirmationLocationState) || {};

  const [registrationId, setRegistrationId] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [participationType, setParticipationType] = useState<string>('ATTEND_ONLY');
  const [performanceType, setPerformanceType] = useState<string | undefined>(undefined);
  const [stageIntroductionName, setStageIntroductionName] = useState<string | undefined>(undefined);
  const [emailSent, setEmailSent] = useState<boolean | null | undefined>(undefined);
  const [wasReferred, setWasReferred] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const storedRef = referralService.getStoredReferral();
    if (state.wasReferred || Boolean(storedRef?.referralCode)) {
      setWasReferred(true);
    }

    if (state.registrationId) {
      setRegistrationId(state.registrationId);
      setVerificationToken(state.verificationToken || 'sec_token_' + state.registrationId);
      setFullName(state.fullName || '');
      setParticipationType(state.participationType || 'ATTEND_ONLY');
      setPerformanceType(state.performanceType);
      setStageIntroductionName(state.stageIntroductionName);
      setEmailSent(state.emailSent);

      // Cache minimal non-sensitive data in sessionStorage for refresh resilience
      sessionStorage.setItem('dobato_reg_id', state.registrationId);
      sessionStorage.setItem('dobato_reg_token', state.verificationToken || 'sec_token_' + state.registrationId);
      sessionStorage.setItem('dobato_reg_type', state.participationType || 'ATTEND_ONLY');
      if (state.fullName) sessionStorage.setItem('dobato_reg_name', state.fullName);
      if (state.performanceType) sessionStorage.setItem('dobato_reg_perf', state.performanceType);
      if (state.stageIntroductionName) sessionStorage.setItem('dobato_reg_stage', state.stageIntroductionName);
    } else {
      const cachedId = sessionStorage.getItem('dobato_reg_id');
      const cachedToken = sessionStorage.getItem('dobato_reg_token');
      const cachedType = sessionStorage.getItem('dobato_reg_type');
      const cachedName = sessionStorage.getItem('dobato_reg_name');
      const cachedPerf = sessionStorage.getItem('dobato_reg_perf');
      const cachedStage = sessionStorage.getItem('dobato_reg_stage');

      if (cachedId) {
        setRegistrationId(cachedId);
        setVerificationToken(cachedToken || 'sec_token_' + cachedId);
        setParticipationType(cachedType || 'ATTEND_ONLY');
        setFullName(cachedName || '');
        if (cachedPerf) setPerformanceType(cachedPerf);
        if (cachedStage) setStageIntroductionName(cachedStage);
      }
    }
  }, [state]);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dobato.app';
  const inviteUrl = `${baseUrl}/register`;

  const shareText = `Dobatoo Grand Launch • OPEN MIC ❤️\n\n16 October 2026\nThe Gardens, Panipokhari, Kathmandu\nPoetry • Music • Storytelling\n\nPoetry Theme: ${EVENT_POETRY_THEME}\n5 Minutes per Participant • No Age Limit\n\nRegister for FREE:`;

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Dobatoo Grand Launch Open Mic',
          text: shareText,
          url: inviteUrl,
        });
      } catch {}
    }
  };

  return (
    <>
      <SEO
        title="You're Registered for Dobatoo — Confirmation"
        description="Registration confirmed for the Dobatoo Grand Launch on 16 October 2026."
      />

      <Section variant="dark" padding="xl" style={{ paddingTop: 'clamp(5.5rem, 9vw, 9rem)' }}>
        <Container size="md">
          <Card variant="glass" glow style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 1.75rem)' }}>
            
            {/* Header / Success Banner */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(244, 114, 182, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#F472B6',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <Badge variant="romantic" size="md" icon={<Sparkles size={14} />} style={{ marginBottom: '1rem' }}>
              REGISTRATION CONFIRMED
            </Badge>

            <Heading as="h1" fontFamily="serif" style={{ fontSize: 'clamp(1.75rem, 3.5vw + 0.8rem, 2.75rem)', marginBottom: '0.35rem' }}>
              You're Registered for <span className="dobatoo-brand-styled">Dobato<span className="dobatoo-brand-accent-oo">o</span></span> ❤️
            </Heading>

            {fullName && (
              <p className="text-body-lg" style={{ color: 'var(--dobato-pink)', fontWeight: 600, marginBottom: '0.35rem' }}>
                Welcome, {fullName}!
              </p>
            )}

            {/* Referral confirmation badge */}
            {wasReferred && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#F472B6',
                  backgroundColor: 'rgba(244, 114, 182, 0.12)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  margin: '0.4rem 0 1rem 0',
                }}
              >
                <Heart size={14} fill="#F472B6" />
                <span>You joined Dobatoo through an invitation ❤️</span>
              </div>
            )}

            <p className="text-body" style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.25rem' }}>
              We look forward to seeing you at the Grand Launch.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--dobato-white)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.4rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '0.65rem',
              }}
            >
              <Calendar size={16} color="#F472B6" />
              {EVENT_DATE}
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--dobato-pink)',
                background: 'rgba(244, 114, 182, 0.1)',
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(244, 114, 182, 0.25)',
                marginBottom: '1.5rem',
              }}
            >
              <MapPin size={15} />
              <span>{EVENT_VENUE_FULL}</span>
            </div>

            {/* Performance Summary if participating */}
            {participationType === 'ATTEND_AND_POETRY' && (performanceType || stageIntroductionName) && (
              <div
                style={{
                  backgroundColor: 'rgba(217, 70, 239, 0.12)',
                  border: '1px solid rgba(217, 70, 239, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  maxWidth: '520px',
                  margin: '0 auto 1.5rem auto',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F472B6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} />
                  <span>Performance Entry Summary</span>
                </div>
                {performanceType && (
                  <div style={{ fontSize: '0.875rem', color: '#ffffff', marginBottom: '0.2rem' }}>
                    <strong>Performance Type:</strong> {performanceType.replace(/_/g, ' ')}
                  </div>
                )}
                {stageIntroductionName && (
                  <div style={{ fontSize: '0.875rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    <strong>Stage Introduction Name:</strong> {stageIntroductionName}
                  </div>
                )}
                <div style={{ fontSize: '0.825rem', color: '#F472B6', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', fontWeight: 600 }}>
                  <span>⏱ Duration: 5 Minutes Max</span>
                  <span>•</span>
                  <span>🎭 No Age Limit</span>
                </div>
              </div>
            )}

            {/* Email Delivery Status Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
                margin: '0 auto 1.75rem auto',
                maxWidth: '520px',
                textAlign: 'center',
                background: emailSent === false ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 114, 182, 0.12)',
                border: emailSent === false ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(244, 114, 182, 0.25)',
                color: emailSent === false ? '#FBBF24' : 'var(--dobato-pink)',
              }}
            >
              {emailSent === true ? (
                <>
                  <Mail size={16} />
                  <span>Your confirmation email has been sent.</span>
                </>
              ) : emailSent === false ? (
                <>
                  <AlertTriangle size={16} />
                  <span>Your registration is confirmed. We were unable to send the email right now.</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Your confirmation email is being processed.</span>
                </>
              )}
            </div>

            {/* Event Pass Card or Fallback */}
            {registrationId ? (
              <EventPass
                registrationId={registrationId}
                verificationToken={verificationToken}
                participationType={participationType}
              />
            ) : (
              <div style={{ padding: '2rem 1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-lg)', margin: '1.5rem 0' }}>
                <p className="text-body" style={{ color: 'var(--dobato-muted)' }}>
                  Your registration ID is no longer available on this device.
                </p>
              </div>
            )}

            {/* DOBATO Event Share Section */}
            <div
              style={{
                margin: '2rem 0',
                padding: '1.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.18) 0%, rgba(236, 72, 153, 0.18) 100%)',
                border: '1px solid rgba(244, 114, 182, 0.35)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dobato-white)', marginBottom: '0.25rem' }}>
                Invite Friends to Dobatoo Open Mic ❤️
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F472B6', marginBottom: '0.75rem' }}>
                Share The Experience
              </div>

              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '520px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                Know someone who loves poetry, music, or storytelling? Invite them to join us at The Gardens, Panipokhari on 16 October 2026.
              </p>

              {/* Link Copy & Share Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '460px', margin: '0 auto 1rem auto', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  onClick={handleCopyInvite}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#EC4899',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Invite Link'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Event Share Card */}
            <div style={{ margin: '1.75rem 0' }}>
              <EventShareCard />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/">
                <Button variant="primary" size="lg" icon={<Home size={18} />}>
                  Return to Dobatoo
                </Button>
              </Link>

              <Link to="/event">
                <Button variant="outline" size="lg">
                  Explore Event Details
                </Button>
              </Link>
            </div>

          </Card>
        </Container>
      </Section>
    </>
  );
};
