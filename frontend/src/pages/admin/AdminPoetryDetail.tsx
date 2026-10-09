import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Feather,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Save,
} from 'lucide-react';
import type { PoetryParticipantDetail, ReviewStatus } from '../../types/poetryJudging';
import { poetryAdminService } from '../../services/admin/poetryAdminService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<PoetryParticipantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Form state
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('PENDING');
  const [internalNote, setInternalNote] = useState('');
  const [savingReview, setSavingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  // Expandable Personal Details section
  const [showPersonal, setShowPersonal] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await poetryAdminService.getParticipantById(id);
        if (res.success && res.data) {
          setParticipant(res.data);
          setReviewStatus(res.data.reviewStatus);
          setInternalNote(res.data.internalNote || '');
        } else {
          setError(res.message || 'Participant not found.');
        }
      } catch {
        setError('Failed retrieving entry details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participant) return;
    setSavingReview(true);
    setReviewMsg(null);

    try {
      const res = await poetryAdminService.updateReviewStatus(
        participant.id,
        reviewStatus,
        internalNote
      );
      if (res.success && res.data) {
        setParticipant(res.data);
        setReviewMsg('Review status updated successfully ✓');
      } else {
        setReviewMsg(res.message || 'Failed updating review status.');
      }
    } catch {
      setReviewMsg('Error saving review status.');
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading poetry entry...</div>;
  }

  if (error || !participant) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Entry Not Found</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          {error || 'The requested poetry participant entry could not be found.'}
        </p>
        <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/poetry')}>
          <ArrowLeft size={16} />
          <span>Back to Poetry Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/poetry')}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate(`/admin/poetry/scoring?participantId=${participant.id}`)}
        >
          <span>Score This Performance</span>
        </button>
      </div>

      <PoetryNavTabs />

      {/* Main Entry Card */}
      <div className="admin-card">
        <div
          style={{
            paddingBottom: '1.25rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 800, color: '#7c3aed' }}>
                {participant.registrationId}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: '#fdf2f8',
                  color: '#db2777',
                  border: '1px solid #fbcfe8',
                }}
              >
                THEME: DOBATO
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.375rem 0 0 0' }}>
              {participant.poetryTitle}
            </h2>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginTop: '0.25rem' }}>
              Performer: {participant.participantName}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.375rem 0.625rem',
                borderRadius: '6px',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
              }}
            >
              {participant.reviewStatus}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.375rem 0.625rem',
                borderRadius: '6px',
                backgroundColor: participant.judgingStatus === 'SCORED' ? '#dcfce7' : '#f1f5f9',
                color: participant.judgingStatus === 'SCORED' ? '#15803d' : '#64748b',
              }}
            >
              JUDGING: {participant.judgingStatus}
            </span>
          </div>
        </div>

        {/* Poetry Technical Specification */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#fcf6ff',
            borderRadius: '8px',
            border: '1px solid #e9d5ff',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700 }}>THEME</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#db2777' }}>
              DOBATO
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700 }}>LANGUAGE</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
              {participant.language}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700 }}>PERFORMANCE TYPE</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
              {participant.performanceType.replace('_', ' ')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700 }}>SUBMISSION DATE</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
              {new Date(participant.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Description / Poem Text */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            POETRY SUMMARY / DESCRIPTION
          </h4>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
            }}
          >
            {participant.description || 'No description submitted.'}
          </div>
        </div>

        {/* Organizer Entry Review Form */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Feather size={18} color="#7c3aed" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Internal Entry Review & Organizer Notes
            </h3>
          </div>

          {reviewMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                backgroundColor: reviewMsg.includes('✓') ? '#dcfce7' : '#fee2e2',
                color: reviewMsg.includes('✓') ? '#15803d' : '#991b1b',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{reviewMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Mark Review Status</label>
              <select
                className="admin-select"
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value as ReviewStatus)}
                style={{ maxWidth: '300px' }}
              >
                <option value="PENDING">Pending Review</option>
                <option value="REVIEWED">Reviewed & Approved for Stage</option>
                <option value="NEEDS_ATTENTION">Needs Organizer Attention</option>
              </select>
            </div>

            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label">Internal Note (Organizer / Staff Only)</label>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {internalNote.length}/500 chars max
                </span>
              </div>
              <textarea
                className="admin-input"
                style={{ height: '90px', padding: '0.75rem', resize: 'vertical' }}
                placeholder="Enter internal organizer notes (e.g. stage props needed, sound requirements)..."
                value={internalNote}
                maxLength={500}
                onChange={(e) => setInternalNote(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                Internal notes are strictly confidential and will never be exposed to participants.
              </span>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              style={{ width: 'fit-content' }}
              disabled={savingReview}
            >
              <Save size={16} />
              <span>{savingReview ? 'Saving...' : 'Save Entry Review'}</span>
            </button>
          </form>
        </div>

        {/* Protected Personal Details Section */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between', height: '44px' }}
            onClick={() => setShowPersonal(!showPersonal)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} color="#7c3aed" />
              <span>Authorized Organizer Personal Contact Data</span>
            </div>
            {showPersonal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showPersonal && participant.personalDetails && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EMAIL</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  {participant.personalDetails.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PHONE</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  {participant.personalDetails.phone}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AGE / GENDER</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  {participant.personalDetails.age} yrs • {participant.personalDetails.gender}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CITY</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  {participant.personalDetails.city}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
