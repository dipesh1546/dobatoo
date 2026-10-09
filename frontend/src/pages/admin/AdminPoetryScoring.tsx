import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Save,
  CheckCircle2,
  Lock,
  Edit,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type {
  JudgingCriterion,
  PoetryParticipantDetail,
  JudgeEntryScore,
  CompetitionStatus,
} from '../../types/poetryJudging';
import { scoringService } from '../../services/admin/scoringService';
import { criteriaService } from '../../services/admin/criteriaService';
import { poetryAdminService } from '../../services/admin/poetryAdminService';
import { judgeService } from '../../services/admin/judgeService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryScoringPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedParticipantId = searchParams.get('participantId');

  const [assignedEntries, setAssignedEntries] = useState<PoetryParticipantDetail[]>([]);
  const [criteria, setCriteria] = useState<JudgingCriterion[]>([]);
  const [compStatus, setCompStatus] = useState<CompetitionStatus>('JUDGING');
  const [activeParticipant, setActiveParticipant] = useState<PoetryParticipantDetail | null>(null);

  // Scores state for active participant: criterionId -> numeric score
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [existingScore, setExistingScore] = useState<JudgeEntryScore | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentJudge = judgeService.getCurrentJudge() || { id: 'JDG-001', name: 'Dr. Ramesh Luitel' };

  const loadScoringData = async () => {
    setLoading(true);
    try {
      const [compRes, critRes, entriesRes] = await Promise.all([
        poetryAdminService.getCompetition(),
        criteriaService.getCriteria(),
        scoringService.getAssignedEntriesForJudge(),
      ]);

      if (compRes.data) setCompStatus(compRes.data.status);
      if (critRes.data) setCriteria(critRes.data);

      if (entriesRes.data && entriesRes.data.length > 0) {
        setAssignedEntries(entriesRes.data);
        const match = selectedParticipantId
          ? entriesRes.data.find((e: PoetryParticipantDetail) => e.id === selectedParticipantId || e.registrationId === selectedParticipantId)
          : entriesRes.data[0];
        setActiveParticipant(match || entriesRes.data[0]);
      }
    } catch (err) {
      console.error('Failed loading scoring interface:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScoringData();
  }, [selectedParticipantId]);

  // Load existing score when active participant changes
  useEffect(() => {
    async function loadScoreForActive() {
      if (!activeParticipant) return;
      try {
        const res = await scoringService.getJudgeScoreForParticipant(currentJudge.id, activeParticipant.id);
        if (res.data) {
          setExistingScore(res.data);
          setScores(res.data.scores || {});
          setComment(res.data.comment || '');
          setSubmitted(true);
        } else {
          setExistingScore(null);
          // Initialize empty scores for criteria
          const init: Record<string, number> = {};
          criteria.forEach((c) => {
            init[c.id] = 8; // Default initial score suggestion
          });
          setScores(init);
          setComment('');
          setSubmitted(false);
        }
      } catch {
        setSubmitted(false);
      }
    }
    loadScoreForActive();
  }, [activeParticipant, criteria]);

  const handleScoreChange = (criterionId: string, val: number, max: number) => {
    const num = Math.min(Math.max(0, val), max);
    setScores((prev) => ({ ...prev, [criterionId]: num }));
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParticipant) return;

    if (compStatus === 'FINALIZED' || compStatus === 'FINAL_REVIEW') {
      setMsg({ type: 'error', text: 'Competition is locked. Score changes are disabled.' });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const res = await scoringService.submitScore(activeParticipant.id, scores, comment);
      if (res.success && res.data) {
        setExistingScore(res.data);
        setSubmitted(true);
        setMsg({ type: 'success', text: 'Score Submitted Successfully ✓' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed submitting score.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error submitting score.' });
    } finally {
      setSubmitting(false);
    }
  };

  const isScoringLocked = compStatus === 'FINAL_REVIEW' || compStatus === 'FINALIZED' || compStatus === 'DRAFT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Official Poetry Judging Interface
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Logged in Judge: <strong>{currentJudge.name}</strong> • Phase: <strong style={{ color: '#7c3aed' }}>{compStatus}</strong>
          </p>
        </div>

        <button className="admin-btn admin-btn-secondary" onClick={() => loadScoringData()}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh Entries</span>
        </button>
      </div>

      <PoetryNavTabs />

      {isScoringLocked && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#9f1239',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <Lock size={20} />
          <span>
            {compStatus === 'FINALIZED'
              ? 'Competition results are finalized and locked. Score modification is disabled.'
              : 'Competition is currently in Final Review. Judge score inputs are closed.'}
          </span>
        </div>
      )}

      {/* Entry Selector Tabs for Mobile/Desktop */}
      <div className="admin-card" style={{ padding: '0.875rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          ASSIGNED POETRY ENTRIES ({assignedEntries.length})
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {assignedEntries.map((e) => {
            const isSelected = activeParticipant?.id === e.id;
            return (
              <button
                key={e.id}
                type="button"
                className={`admin-btn ${isSelected ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ height: '36px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setActiveParticipant(e);
                  setMsg(null);
                }}
              >
                <span>{e.registrationId}</span>
                <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>({e.participantName.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeParticipant && (
        <div className="admin-card">
          {/* Active Entry Header */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace' }}>
              REGISTRATION ID: {activeParticipant.registrationId}
            </span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
              {activeParticipant.poetryTitle}
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#475569' }}>
              Performer: <strong>{activeParticipant.participantName}</strong> • {activeParticipant.language} • {activeParticipant.performanceType.replace('_', ' ')}
              {existingScore && (
                <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: '#6b21a8', fontStyle: 'italic' }}>
                  (Last updated: {new Date(existingScore.updatedAt).toLocaleTimeString()})
                </span>
              )}
            </div>
            {activeParticipant.description && (
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontStyle: 'italic' }}>
                "{activeParticipant.description}"
              </p>
            )}
          </div>

          {msg && (
            <div
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '6px',
                backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: msg.type === 'success' ? '#15803d' : '#991b1b',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{msg.text}</span>
            </div>
          )}

          {submitted && !isScoringLocked && (
            <div
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '6px',
                backgroundColor: '#f3e8ff',
                border: '1px solid #d8b4fe',
                color: '#6b21a8',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Score Submitted for this entry</span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ height: '32px', fontSize: '0.75rem' }}
                onClick={() => setSubmitted(false)}
              >
                <Edit size={14} />
                <span>Edit Score</span>
              </button>
            </div>
          )}

          {/* Scoring Form */}
          <form onSubmit={handleSubmitScore} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {criteria.map((crit) => {
                const currentVal = scores[crit.id] ?? 8;
                return (
                  <div
                    key={crit.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                          {crit.name} (Weight: {crit.weight}%)
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>
                          {crit.description}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#7c3aed',
                          backgroundColor: '#f3e8ff',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #d8b4fe',
                        }}
                      >
                        {currentVal} / {crit.maxScore}
                      </div>
                    </div>

                    {/* Touch-Friendly Mobile Score Range / Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <input
                        type="range"
                        min={0}
                        max={crit.maxScore}
                        step={1}
                        value={currentVal}
                        disabled={submitted || isScoringLocked}
                        onChange={(e) => handleScoreChange(crit.id, Number(e.target.value), crit.maxScore)}
                        style={{ flex: 1, accentColor: '#7c3aed', height: '24px', cursor: 'pointer' }}
                      />

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {[...Array(crit.maxScore + 1)].map((_, val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={submitted || isScoringLocked}
                            onClick={() => handleScoreChange(crit.id, val, crit.maxScore)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              border: currentVal === val ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                              backgroundColor: currentVal === val ? '#7c3aed' : '#ffffff',
                              color: currentVal === val ? '#ffffff' : '#334155',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Judge Comment */}
            <div className="admin-form-group">
              <label className="admin-label">Judge Performance Comment (Optional)</label>
              <textarea
                className="admin-input"
                style={{ height: '80px', padding: '0.75rem', resize: 'vertical' }}
                placeholder="Enter confidential judge observations regarding delivery, rhythm, or stage presence..."
                value={comment}
                disabled={submitted || isScoringLocked}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {!submitted && !isScoringLocked && (
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ height: '48px', fontSize: '1rem' }}
                disabled={submitting}
              >
                <Save size={18} />
                <span>{submitting ? 'Submitting Score...' : 'Submit Score'}</span>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
