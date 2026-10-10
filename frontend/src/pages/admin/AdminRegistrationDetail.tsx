import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Feather,
  Copy,
  Check,
  XCircle,
  Share2,
  Info,
  CreditCard,
  Upload,
  Loader2,
} from 'lucide-react';
import type { RegistrationDetails } from '../../types/admin';
import { adminRegistrationService } from '../../services/admin/adminRegistrationService';
import { registrationService } from '../../services/registrationService';
import { ParticipantIdCardModal } from '../../components/admin/idCard';

export const AdminRegistrationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleDetailPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !registration) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif|jpg)$/i)) {
      setPhotoError('Please select a valid image (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image must be less than 5MB.');
      return;
    }

    setPhotoError(null);
    setIsUpdatingPhoto(true);

    try {
      const uploadRes = await registrationService.uploadPhoto(file);
      if (uploadRes.success && uploadRes.url) {
        const updateRes = await adminRegistrationService.updateRegistrationPhoto(registration.id, uploadRes.url);
        if (updateRes.success) {
          setRegistration((prev) => prev ? { ...prev, photoUrl: uploadRes.url } : prev);
        } else {
          setPhotoError(updateRes.message || 'Failed to update participant photo.');
        }
      } else {
        setPhotoError(uploadRes.error || 'Failed to upload photo.');
      }
    } catch {
      setPhotoError('Error occurred while updating photo.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await adminRegistrationService.getRegistrationById(id);
        if (res.success && res.data) {
          setRegistration(res.data);
        } else {
          setError(res.message || 'Registration details not found.');
        }
      } catch {
        setError('Failed to retrieve registration details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  const handleCopyRegistrationId = async () => {
    const regId = registration?.registrationId || registration?.id || '';
    if (!regId) return;
    try {
      await navigator.clipboard.writeText(regId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Loading registration details...
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
          Registration Not Found
        </h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          {error || 'The requested registration record could not be found.'}
        </p>
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() => navigate('/admin/registrations')}
        >
          <ArrowLeft size={16} />
          <span>Back to Registrations</span>
        </button>
      </div>
    );
  }

  const regId = registration.registrationId || registration.id;
  const isPerformer = registration.participationType === 'ATTEND_AND_POETRY';
  const perfType = registration.performance?.performanceType || registration.performanceType;
  const stageName = registration.performance?.stageIntroductionName || registration.stageIntroductionName;
  const perfDescription = registration.performance?.description || (registration as any).performanceDescription;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() => navigate('/admin/registrations')}
        >
          <ArrowLeft size={16} />
          <span>Back to Registrations</span>
        </button>

        <span className={`badge-admin-status ${(registration.status || 'REGISTERED').toLowerCase().replace('_', '-')}`}>
          {registration.status || 'REGISTERED'}
        </span>
      </div>

      {/* Prominent Registration ID Hero Card */}
      <div
        className="admin-card"
        style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%)',
          border: '1.5px solid #d8b4fe',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            REGISTRATION ID
          </div>
          <div
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#4c1d95',
              letterSpacing: '0.04em',
              marginTop: '0.2rem',
            }}
          >
            {regId}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCardModal(true)}
            className="admin-btn admin-btn-secondary"
            style={{
              height: '40px',
              padding: '0 1.25rem',
              gap: '0.5rem',
              borderColor: '#ec4899',
              color: '#db2777',
              fontWeight: 700,
            }}
          >
            <CreditCard size={16} color="#ec4899" />
            <span>View & Print ID Card</span>
          </button>

          <button
            onClick={handleCopyRegistrationId}
            className="admin-btn admin-btn-primary"
            style={{ height: '40px', padding: '0 1.25rem', gap: '0.5rem' }}
          >
            {copiedId ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedId ? 'Copied ID' : 'Copy Registration ID'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: REGISTRATION INFORMATION */}
      <div className="admin-card">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#7c3aed',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Info size={16} />
          <span>Registration Information</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REGISTRATION ID</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', marginTop: '0.15rem' }}>
              {regId}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REGISTRATION DATE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.15rem' }}>
              {new Date(registration.createdAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PARTICIPATION STATUS</div>
            <div style={{ marginTop: '0.25rem' }}>
              <span className={`badge-admin-status ${(registration.status || 'REGISTERED').toLowerCase().replace('_', '-')}`}>
                {registration.status || 'REGISTERED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERSONAL INFORMATION */}
      <div className="admin-card">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#7c3aed',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <User size={16} />
          <span>Personal Information</span>
        </h3>

        {/* Profile Avatar & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
          {registration.photoUrl ? (
            <a
              href={registration.photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Click to view high-resolution photo"
              style={{ display: 'inline-flex' }}
            >
              <img
                src={registration.photoUrl}
                alt={registration.fullName}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #7c3aed',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                  cursor: 'pointer',
                }}
              />
            </a>
          ) : (
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                border: '2px dashed #cbd5e1',
              }}
            >
              {registration.fullName ? registration.fullName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {registration.fullName}
            </div>
            {registration.photoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  Photo Attached
                </span>
                <a
                  href={registration.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.8125rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Open Full Photo ↗
                </a>
              </div>
            ) : (
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                No photo uploaded yet
              </div>
            )}

            {/* Quick Upload / Change Photo button */}
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <label
                className="admin-btn admin-btn-secondary"
                style={{
                  height: '28px',
                  fontSize: '0.75rem',
                  padding: '0 0.65rem',
                  cursor: isUpdatingPhoto ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  fontWeight: 600,
                }}
              >
                {isUpdatingPhoto ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    <span>{registration.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUpdatingPhoto}
                  style={{ display: 'none' }}
                  onChange={handleDetailPhotoSelect}
                />
              </label>

              {photoError && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                  {photoError}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>FULL NAME</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
              {registration.fullName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EMAIL ADDRESS</div>
            <div style={{ fontSize: '0.95rem', color: '#475569', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} color="#94a3b8" />
              <a href={`mailto:${registration.email}`} style={{ color: '#7c3aed', textDecoration: 'none' }}>
                {registration.email}
              </a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PHONE NUMBER</div>
            <div style={{ fontSize: '0.95rem', color: '#475569', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={14} color="#94a3b8" />
              <a href={`tel:${registration.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                {registration.phone}
              </a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>GENDER</div>
            <div style={{ fontSize: '0.95rem', color: '#0f172a', marginTop: '0.15rem', fontWeight: 600 }}>
              {registration.gender ? registration.gender.replace(/_/g, ' ') : 'Not Specified'}
            </div>
          </div>

          {registration.photoUrl && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>GIVEAWAY PHOTO PREVIEW</div>
              <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a href={registration.photoUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={registration.photoUrl}
                    alt="Participant"
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
                  />
                </a>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Click to inspect full resolution
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: PERFORMANCE INFORMATION */}
      <div className="admin-card">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#7c3aed',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Feather size={16} />
          <span>Performance Information</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PARTICIPATION TYPE</div>
            <div style={{ marginTop: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: isPerformer ? '#fdf2f8' : '#f1f5f9',
                  color: isPerformer ? '#db2777' : '#475569',
                }}
              >
                {isPerformer ? 'Open Mic Performer' : 'Audience (Attend Only)'}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PERFORMANCE TYPE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {isPerformer ? (perfType ? perfType.replace(/_/g, ' ') : 'General Performance') : 'N/A (Audience)'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>STAGE NAME / INTRODUCTION</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
              {isPerformer ? (stageName || registration.fullName) : '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>POETRY THEME</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.2rem' }}>
              {isPerformer ? 'DOBATO' : '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PERFORMANCE DURATION</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
              {isPerformer ? '5 Minutes Max' : '—'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AGE LIMIT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
              No Age Limit
            </div>
          </div>
        </div>

        {isPerformer && perfDescription && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
              PERFORMANCE NOTES / DESCRIPTION
            </div>
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              {perfDescription}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: EVENT INFORMATION */}
      <div className="admin-card">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#7c3aed',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Calendar size={16} />
          <span>Event Information</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EVENT NAME</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
              {registration.eventName || 'DOBATOO Grand Launch'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EVENT DATE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.15rem' }}>
              {registration.eventDate || '16 October 2026'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>VENUE</div>
            <div style={{ fontSize: '0.95rem', color: '#0f172a', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#94a3b8" />
              <span>{registration.venueName || 'The Gardens, Panipokhari, Kathmandu, Nepal'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>FORMAT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#db2777', marginTop: '0.15rem' }}>
              OPEN MIC
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: SOURCE INFORMATION */}
      <div className="admin-card">
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#7c3aed',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Share2 size={16} />
          <span>Source Information</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>WHERE THEY FOUND THE EVENT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginTop: '0.15rem' }}>
              {registration.discoverySource === 'OTHERS'
                ? `Other: ${registration.discoverySourceOther || 'Unspecified'}`
                : registration.discoverySource || 'Direct / Organic'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PHOTOGRAPH & VIDEO AGREEMENT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: (registration.mediaAgreement ?? registration.mediaConsent) ? '#16a34a' : '#64748b', marginTop: '0.15rem' }}>
              {(registration.mediaAgreement ?? registration.mediaConsent) ? '✓ Agreed to event photography/video' : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Participant ID Card Modal */}
      <ParticipantIdCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        participant={registration}
      />
    </div>
  );
};
