import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/common/SEO/SEO';
import { Section } from '../components/ui/Section/Section';
import { Container } from '../components/ui/Container/Container';
import { Heading } from '../components/ui/Heading/Heading';
import { GradientText } from '../components/ui/GradientText/GradientText';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { EVENT_DATE, EVENT_VENUE_NAME, EVENT_VENUE_FULL } from '../constants/brand';
import { registrationService } from '../services/registrationService';
import type {
  ParticipationType,
  GenderType,
  PerformanceType,
  DiscoverySource,
  RegistrationPayload,
} from '../types/api';
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Edit2,
  CheckCircle2,
  Feather,
  Users,
  MapPin,
} from 'lucide-react';
import './Register.css';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  discoverySource?: string;
  discoverySourceOther?: string;
  performanceType?: string;
  stageIntroductionName?: string;
  mediaConsent?: string;
  apiError?: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-Step State: 1 = Participation, 2 = Details, 3 = Performance Details (if participating), 4 = Review & Agreement
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields State
  const [participationType, setParticipationType] = useState<ParticipationType>('ATTEND_ONLY');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<GenderType>('PREFER_NOT_TO_SAY');

  // Discovery Field
  const [discoverySource, setDiscoverySource] = useState<DiscoverySource>('INSTAGRAM');
  const [discoverySourceOther, setDiscoverySourceOther] = useState<string>('');

  // Performance Fields State (Only when participating)
  const [performanceType, setPerformanceType] = useState<PerformanceType>('POETRY');
  const [stageIntroductionName, setStageIntroductionName] = useState<string>('');
  const [performanceDescription, setPerformanceDescription] = useState<string>('');

  // Single Photograph/Video Agreement
  const [mediaConsent, setMediaConsent] = useState<boolean>(false);

  // Errors State
  const [errors, setErrors] = useState<FormErrors>({});

  const isParticipating = participationType === 'ATTEND_AND_POETRY';
  const totalSteps = isParticipating ? 4 : 3;

  // Step 2 Validation (Personal Details & Discovery)
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneClean = phone.replace(/\s+|-/g, '');
    const phoneRegex = /^(?:\+?977)?9[78]\d{8}$/;
    if (!phoneClean || !phoneRegex.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number (e.g. 98XXXXXXXX).';
    }

    if (!discoverySource) {
      newErrors.discoverySource = 'Please select where you found out about this event.';
    }

    if (discoverySource === 'OTHERS' && !discoverySourceOther.trim()) {
      newErrors.discoverySourceOther = 'Please specify where you found out about us.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation (Performance Details)
  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!performanceType) {
      newErrors.performanceType = 'Please select a performance type.';
    }

    if (!stageIntroductionName.trim()) {
      newErrors.stageIntroductionName = 'Please enter how you would like to be introduced on stage.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setErrors({});

    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        if (isParticipating) {
          setCurrentStep(3);
        } else {
          setCurrentStep(4);
        }
      }
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep === 4) {
      if (isParticipating) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors({});

    if (!mediaConsent) {
      setErrors({ mediaConsent: 'You must agree to the photograph/video usage to submit registration.' });
      return;
    }

    setIsSubmitting(true);

    const payload: RegistrationPayload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender: gender,
      participationType: participationType,
      discoverySource: discoverySource,
      discoverySourceOther: discoverySource === 'OTHERS' ? discoverySourceOther.trim() : undefined,
      stageIntroductionName: isParticipating ? stageIntroductionName.trim() : undefined,
      performanceType: isParticipating ? performanceType : undefined,
      performanceDescription: isParticipating ? performanceDescription.trim() || undefined : undefined,
      mediaAgreement: true,
      topic: isParticipating ? 'DOBATO' : undefined,
    };

    try {
      const response = await registrationService.submitRegistration(payload);

      if (response.success && response.data?.registrationId) {
        navigate('/thank-you', {
          state: {
            registrationId: response.data.registrationId,
            verificationToken: response.data.verificationToken,
            emailSent: response.data.emailSent,
            fullName: response.data.fullName || fullName,
            email: response.data.email || email,
            participationType: response.data.participationType || participationType,
            performanceType: isParticipating ? performanceType : undefined,
            stageIntroductionName: isParticipating ? stageIntroductionName : undefined,
          },
        });
      } else {
        setErrors({
          apiError: response.message || 'Registration could not be completed. Please try again.',
        });
      }
    } catch (err: any) {
      setErrors({
        apiError: err?.message || 'Something went wrong while completing your registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgressNumber = (stepNum: number) => {
    if (currentStep > stepNum) return <Check size={12} />;
    return stepNum;
  };

  return (
    <>
      <SEO
        title={`Register Free — DOBATO Grand Launch Open Mic • ${EVENT_VENUE_NAME}`}
        description={`Register for free for the DOBATO Grand Launch Open Mic event on 16 October 2026 at ${EVENT_VENUE_FULL}. Poetry Theme: DOBATO.`}
      />

      <Section variant="dark" padding="xl" className="register-container">
        <Container size="lg" style={{ textAlign: 'center' }}>

          {/* Header */}
          <Badge variant="romantic" size="md" icon={<Sparkles size={14} />} style={{ marginBottom: '1rem' }}>
            FREE EVENT REGISTRATION
          </Badge>

          <Heading as="h1" fontFamily="serif" style={{ marginBottom: '0.5rem' }}>
            Finding the <GradientText variant="primary">Right Person.</GradientText>
          </Heading>

          <p className="text-body-lg" style={{ marginBottom: '0.4rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>
            DOBATO Grand Launch • {EVENT_DATE}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: 'var(--dobato-pink)',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '1.25rem',
            }}
          >
            <MapPin size={16} />
            <span>{EVENT_VENUE_FULL}</span>
          </div>

          <p className="text-body-sm" style={{ color: 'var(--dobato-pink)', fontWeight: 600, marginBottom: '2rem' }}>
            Two paths meeting at the right point. Registration is FREE.
          </p>

          {/* Progress Indicator */}
          <div className="step-progress-bar" role="navigation" aria-label="Registration Progress">
            <div className={`step-progress-item ${currentStep === 1 ? 'step-progress-item-active' : currentStep > 1 ? 'step-progress-item-completed' : ''}`}>
              <span className="step-progress-number">{getStepProgressNumber(1)}</span>
              <span>Participation</span>
            </div>

            <div className={`step-progress-item ${currentStep === 2 ? 'step-progress-item-active' : currentStep > 2 ? 'step-progress-item-completed' : ''}`}>
              <span className="step-progress-number">{getStepProgressNumber(2)}</span>
              <span>Details</span>
            </div>

            {isParticipating && (
              <div className={`step-progress-item ${currentStep === 3 ? 'step-progress-item-active' : currentStep > 3 ? 'step-progress-item-completed' : ''}`}>
                <span className="step-progress-number">{getStepProgressNumber(3)}</span>
                <span>Performance</span>
              </div>
            )}

            <div className={`step-progress-item ${currentStep === 4 ? 'step-progress-item-active' : ''}`}>
              <span className="step-progress-number">{isParticipating ? '4' : '3'}</span>
              <span>Review</span>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--dobato-muted)', fontWeight: 600, marginBottom: '1.5rem' }}>
            Step {currentStep === 4 && !isParticipating ? 3 : currentStep} of {totalSteps}
          </div>

          {/* Form Content Area */}
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <Card variant="glass" glow style={{ padding: '2rem 1.75rem', textAlign: 'left' }}>
              
              {/* STEP 1: PARTICIPATION TYPE */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <Heading as="h3" fontFamily="sans" style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                    How would you like to join?
                  </Heading>
                  <p className="text-body-sm" style={{ marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Choose whether you only want to attend or also participate in performances.
                  </p>

                  <div className="participation-cards-grid">
                    <div
                      className={`selectable-card ${participationType === 'ATTEND_ONLY' ? 'selectable-card-selected' : ''}`}
                      onClick={() => setParticipationType('ATTEND_ONLY')}
                      role="radio"
                      aria-checked={participationType === 'ATTEND_ONLY'}
                      tabIndex={0}
                    >
                      <div className="card-check-indicator">
                        {participationType === 'ATTEND_ONLY' && <Check size={16} color="#FFFFFF" />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dobato-white)', marginBottom: '0.5rem' }}>
                        <Users size={20} color="#F472B6" />
                        <span>Attend Only</span>
                      </div>

                      <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Attend the launch event, enjoy music, poetry, and curated social connections.
                      </p>
                    </div>

                    <div
                      className={`selectable-card ${participationType === 'ATTEND_AND_POETRY' ? 'selectable-card-selected' : ''}`}
                      onClick={() => setParticipationType('ATTEND_AND_POETRY')}
                      role="radio"
                      aria-checked={participationType === 'ATTEND_AND_POETRY'}
                      tabIndex={0}
                    >
                      <div className="card-check-indicator">
                        {participationType === 'ATTEND_AND_POETRY' && <Check size={16} color="#FFFFFF" />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dobato-pink)', marginBottom: '0.5rem' }}>
                        <Feather size={20} color="#EC4899" />
                        <span>Attend & Participate</span>
                      </div>

                      <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Perform Poetry, Story Telling, Music, or Other expressions and compete for cash prizes (1st: NPR 3,000 | 2nd: NPR 2,000).
                      </p>

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.65rem', flexWrap: 'wrap', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dobato-pink)' }}>
                        <span>⏱ 5 Minutes per Participant</span>
                        <span>•</span>
                        <span>🎭 No Age Limit</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />} iconPosition="right">
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL INFORMATION & DISCOVERY */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <Heading as="h3" fontFamily="sans" style={{ marginBottom: '0.35rem', fontSize: '1.25rem' }}>
                    Your Details
                  </Heading>
                  <p className="text-body-sm" style={{ marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Please enter your contact information.
                  </p>

                  <div className="dobato-form-grid" style={{ gap: '1.15rem' }}>
                    {/* Full Name */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="fullName">
                        <span>Full Name <span className="dobato-required">*</span></span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={`dobato-input ${errors.fullName ? 'dobato-input-error' : ''}`}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.fullName}</span>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="dobato-field">
                      <label className="dobato-label" htmlFor="email">
                        <span>Email Address <span className="dobato-required">*</span></span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`dobato-input ${errors.email ? 'dobato-input-error' : ''}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.email}</span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="dobato-field">
                      <label className="dobato-label" htmlFor="phone">
                        <span>Phone Number <span className="dobato-required">*</span></span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`dobato-input ${errors.phone ? 'dobato-input-error' : ''}`}
                        placeholder="98XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.phone}</span>
                      )}
                    </div>

                    {/* Gender (Optional) */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="gender">
                        <span>Gender <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>(Optional)</span></span>
                      </label>
                      <select
                        id="gender"
                        className="dobato-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as GenderType)}
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* Where did you find out about this event? */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="discoverySource">
                        <span>Where did you find out about this event? <span className="dobato-required">*</span></span>
                      </label>
                      <select
                        id="discoverySource"
                        className={`dobato-select ${errors.discoverySource ? 'dobato-input-error' : ''}`}
                        value={discoverySource}
                        onChange={(e) => setDiscoverySource(e.target.value as DiscoverySource)}
                      >
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="FRIENDS">Friends</option>
                        <option value="OTHERS">Others</option>
                      </select>
                      {errors.discoverySource && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.discoverySource}</span>
                      )}
                    </div>

                    {/* If Others, specify */}
                    {discoverySource === 'OTHERS' && (
                      <div className="dobato-field form-group-full">
                        <label className="dobato-label" htmlFor="discoverySourceOther">
                          <span>Please specify <span className="dobato-required">*</span></span>
                        </label>
                        <input
                          id="discoverySourceOther"
                          type="text"
                          className={`dobato-input ${errors.discoverySourceOther ? 'dobato-input-error' : ''}`}
                          placeholder="Tell us how you found out about DOBATO"
                          value={discoverySourceOther}
                          onChange={(e) => setDiscoverySourceOther(e.target.value)}
                        />
                        {errors.discoverySourceOther && (
                          <span className="field-error-msg"><AlertCircle size={14} />{errors.discoverySourceOther}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <Button variant="ghost" size="md" onClick={handleBack} icon={<ArrowLeft size={16} />}>
                      Back
                    </Button>

                    <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />} iconPosition="right">
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: PERFORMANCE DETAILS (If Participating) */}
              {currentStep === 3 && isParticipating && (
                <div className="animate-fade-in">
                  <Heading as="h3" fontFamily="serif" style={{ marginBottom: '0.35rem', fontSize: '1.25rem' }}>
                    Open Mic Performance Details
                  </Heading>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dobato-pink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      POETRY THEME
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--dobato-white)', marginTop: '0.15rem' }}>
                      DOBATO
                    </div>
                    <p className="text-body-sm" style={{ marginTop: '0.25rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Open Mic Event — Share your poetry, story, or music under the theme <strong>DOBATO</strong>.
                    </p>
                  </div>

                  {/* Performance Rules Card */}
                  <div
                    style={{
                      background: 'rgba(217, 70, 239, 0.1)',
                      border: '1px solid rgba(244, 114, 182, 0.25)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dobato-pink)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                      OPEN MIC GUIDELINES
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--dobato-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                          ⏱ Performance Duration
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                          5 Minutes per Participant
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--dobato-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                          🎭 Age Limit
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dobato-white)' }}>
                          No Age Limit
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--dobato-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                          ✨ Theme
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dobato-pink)' }}>
                          DOBATO
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dobato-form-grid" style={{ gap: '1.15rem' }}>
                    {/* Performance Type */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="performanceType">
                        <span>Performance Type <span className="dobato-required">*</span></span>
                      </label>
                      <select
                        id="performanceType"
                        className={`dobato-select ${errors.performanceType ? 'dobato-input-error' : ''}`}
                        value={performanceType}
                        onChange={(e) => setPerformanceType(e.target.value as PerformanceType)}
                      >
                        <option value="POETRY">Poetry</option>
                        <option value="STORY_TELLING">Story Telling</option>
                        <option value="MUSIC">Music</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {errors.performanceType && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.performanceType}</span>
                      )}
                    </div>

                    {/* Stage Introduction Name */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="stageIntroductionName">
                        <span>How would you like to be introduced on stage? <span className="dobato-required">*</span></span>
                      </label>
                      <span style={{ fontSize: '0.8rem', color: 'var(--dobato-muted)', marginBottom: '0.25rem', display: 'block' }}>
                        Enter your full name or any stage name you'd like us to use.
                      </span>
                      <input
                        id="stageIntroductionName"
                        type="text"
                        className={`dobato-input ${errors.stageIntroductionName ? 'dobato-input-error' : ''}`}
                        placeholder="Stage Name / Full Name"
                        value={stageIntroductionName}
                        onChange={(e) => setStageIntroductionName(e.target.value)}
                      />
                      {errors.stageIntroductionName && (
                        <span className="field-error-msg"><AlertCircle size={14} />{errors.stageIntroductionName}</span>
                      )}
                    </div>

                    {/* Performance Description */}
                    <div className="dobato-field form-group-full">
                      <label className="dobato-label" htmlFor="performanceDescription">
                        <span>Performance Description / Notes <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>(Optional)</span></span>
                      </label>
                      <textarea
                        id="performanceDescription"
                        rows={3}
                        maxLength={500}
                        className="dobato-textarea"
                        placeholder="Brief notes about your poem, story, or performance..."
                        value={performanceDescription}
                        onChange={(e) => setPerformanceDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <Button variant="ghost" size="md" onClick={handleBack} icon={<ArrowLeft size={16} />}>
                      Back
                    </Button>

                    <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />} iconPosition="right">
                      Review Registration →
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SINGLE PHOTOGRAPH/VIDEO AGREEMENT */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <Heading as="h3" fontFamily="sans" style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>
                    Review & Agreement
                  </Heading>

                  {/* API Error Banner if any */}
                  {errors.apiError && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #EF4444',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.875rem 1rem',
                        marginBottom: '1.25rem',
                        color: '#F87171',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span>{errors.apiError}</span>
                    </div>
                  )}

                  {/* Review Summary Card */}
                  <div className="review-summary-card">
                    {/* 1. Participation */}
                    <div className="review-section">
                      <div className="review-header-row">
                        <span className="review-title">1. Participation</span>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} icon={<Edit2 size={12} />}>
                          Edit
                        </Button>
                      </div>
                      <div className="review-value">
                        {isParticipating
                          ? '🎤 Attend & Participate in Performances'
                          : '🎉 Attend Event Only'}
                      </div>
                    </div>

                    {/* 2. Personal Details */}
                    <div className="review-section">
                      <div className="review-header-row">
                        <span className="review-title">2. Contact Details</span>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} icon={<Edit2 size={12} />}>
                          Edit
                        </Button>
                      </div>
                      <div className="review-data-grid">
                        <div>
                          <span className="review-label">Name</span>
                          <span className="review-value">{fullName}</span>
                        </div>
                        <div>
                          <span className="review-label">Email</span>
                          <span className="review-value">{email}</span>
                        </div>
                        <div>
                          <span className="review-label">Phone</span>
                          <span className="review-value">{phone}</span>
                        </div>
                        <div>
                          <span className="review-label">Gender</span>
                          <span className="review-value">{gender.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="review-label">Discovery Source</span>
                          <span className="review-value">
                            {discoverySource === 'OTHERS' ? `Others (${discoverySourceOther})` : discoverySource}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Performance Details (If Participating) */}
                    {isParticipating && (
                      <div className="review-section">
                        <div className="review-header-row">
                          <span className="review-title">3. Performance Details</span>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} icon={<Edit2 size={12} />}>
                            Edit
                          </Button>
                        </div>
                        <div className="review-data-grid">
                          <div>
                            <span className="review-label">Performance Type</span>
                            <span className="review-value">{performanceType.replace(/_/g, ' ')}</span>
                          </div>
                          <div>
                            <span className="review-label">Stage Name</span>
                            <span className="review-value">{stageIntroductionName}</span>
                          </div>
                          <div>
                            <span className="review-label">Theme</span>
                            <span className="review-value" style={{ color: 'var(--dobato-pink)', fontWeight: 700 }}>DOBATO</span>
                          </div>
                          <div>
                            <span className="review-label">Duration</span>
                            <span className="review-value">5 Minutes Max</span>
                          </div>
                          <div>
                            <span className="review-label">Age Limit</span>
                            <span className="review-value">No Age Limit</span>
                          </div>
                          {performanceDescription && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <span className="review-label">Notes</span>
                              <span className="review-value" style={{ fontWeight: 400 }}>{performanceDescription}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Single Photograph/Video Agreement */}
                  <div style={{ margin: '1.5rem 0' }}>
                    <label className="consent-checkbox-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="consent-checkbox-input"
                        checked={mediaConsent}
                        onChange={(e) => setMediaConsent(e.target.checked)}
                      />
                      <span className="consent-label-text" style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.9)' }}>
                        By submitting form, you agree that DOBATO may use photographs/videos of your participation for promotional purposes. <span className="dobato-required">*</span>
                      </span>
                    </label>

                    {errors.mediaConsent && (
                      <span className="field-error-msg" style={{ marginTop: '0.5rem' }}>
                        <AlertCircle size={14} />{errors.mediaConsent}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <Button variant="ghost" size="md" onClick={handleBack} disabled={isSubmitting} icon={<ArrowLeft size={16} />}>
                      Back
                    </Button>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      icon={<CheckCircle2 size={18} />}
                      iconPosition="right"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Registration →'}
                    </Button>
                  </div>
                </div>
              )}

            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
};
