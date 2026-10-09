import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Lock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import type { ScoreSummary, WinnerSelection, WinnerSlot, CompetitionStatus } from '../../types/poetryJudging';
import { winnerService } from '../../services/admin/winnerService';
import { resultsService } from '../../services/admin/resultsService';
import { poetryAdminService } from '../../services/admin/poetryAdminService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryWinnersPage: React.FC = () => {
  const [compStatus, setCompStatus] = useState<CompetitionStatus>('JUDGING');
  const [candidates, setCandidates] = useState<ScoreSummary[]>([]);
  const [selection, setSelection] = useState<WinnerSelection>({});

  const [firstId, setFirstId] = useState('');
  const [secondId, setSecondId] = useState('');
  const [thirdId, setThirdId] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, resData, winData] = await Promise.all([
        poetryAdminService.getCompetition(),
        resultsService.getResults(),
        winnerService.getWinnerSelection(),
      ]);

      if (compRes.data) setCompStatus(compRes.data.status);
      if (resData.data) setCandidates(resData.data);

      if (winData.data) {
        setSelection(winData.data);
        if (winData.data.firstPlace) setFirstId(winData.data.firstPlace.participantId);
        if (winData.data.secondPlace) setSecondId(winData.data.secondPlace.participantId);
        if (winData.data.thirdPlace) setThirdId(winData.data.thirdPlace.participantId);
      }
    } catch (err) {
      console.error('Failed loading winner selection:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const buildSlot = (id: string, prizeText: string): WinnerSlot | null => {
    const found = candidates.find((c) => c.participantId === id || c.registrationId === id);
    if (!found) return null;
    return {
      participantId: found.participantId,
      registrationId: found.registrationId,
      participantName: found.participantName,
      poetryTitle: found.poetryTitle,
      weightedScore: found.weightedScore,
      prizeText,
    };
  };

  const constructPayload = () => {
    return {
      firstPlace: buildSlot(firstId, 'NPR 3,000 + DOBATO Trophy + T-shirt + Lifetime Free DOBATO Access'),
      secondPlace: buildSlot(secondId, 'NPR 2,000 + DOBATO Trophy + T-shirt + 6 Months Free DOBATO Access'),
      thirdPlace: buildSlot(thirdId, 'DOBATO Trophy + DOBATO T-shirt + 3 Months Free DOBATO Access'),
    };
  };

  const handleSaveSelection = async () => {
    const payload = constructPayload();
    setSaving(true);
    setMsg(null);

    try {
      const res = await winnerService.saveWinnerSelection(payload);
      if (res.success && res.data) {
        setSelection(res.data);
        setMsg({ type: 'success', text: 'Winner selection draft saved successfully ✓' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Duplicate participant selected across prize slots.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed saving winner selection.' });
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizeResults = async () => {
    const payload = constructPayload();
    setSaving(true);
    setMsg(null);

    try {
      const res = await winnerService.finalizeCompetition(payload);
      if (res.success && res.data) {
        setSelection(res.data);
        setCompStatus('FINALIZED');
        setShowConfirmModal(false);
        setMsg({ type: 'success', text: 'Competition Results Finalized & Locked Successfully ✓' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed finalizing competition.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error finalizing competition.' });
    } finally {
      setSaving(false);
    }
  };

  const isLocked = compStatus === 'FINALIZED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Winner Selection & Finalization
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Assign official DOBATO Grand Launch 1st, 2nd, and 3rd place competition winners
          </p>
        </div>

        <button className="admin-btn admin-btn-secondary" onClick={() => loadData()}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <PoetryNavTabs />

      {isLocked && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            fontWeight: 800,
            fontSize: '1rem',
          }}
        >
          <Lock size={24} color="#16a34a" />
          <div>
            <div>COMPETITION RESULTS FINALIZED & LOCKED 🔒</div>
            <div style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: 500, marginTop: '0.25rem' }}>
              Finalized at: {selection.finalizedAt ? new Date(selection.finalizedAt).toLocaleString() : 'Just now'} • All winner selections and judging scores are permanently locked.
            </div>
          </div>
        </div>
      )}

      {msg && (
        <div
          style={{
            padding: '0.875rem 1rem',
            borderRadius: '6px',
            backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: msg.type === 'success' ? '#15803d' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 3 Prize Slot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* 1st Prize */}
        <div className="admin-card" style={{ border: '2px solid #eab308', backgroundColor: '#fefce8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Trophy size={22} color="#ca8a04" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#854d0e', margin: 0 }}>
              1st Prize Winner
            </h3>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #fef08a', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ca8a04' }}>NPR 3,000</div>
            <div style={{ fontSize: '0.75rem', color: '#713f12', fontWeight: 600 }}>
              DOBATO Trophy + DOBATO T-shirt + Lifetime Free Access
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Select Participant</label>
            <select
              className="admin-select"
              value={firstId}
              disabled={isLocked}
              onChange={(e) => setFirstId(e.target.value)}
            >
              <option value="">-- Choose 1st Place Winner --</option>
              {candidates.map((c) => (
                <option key={c.participantId} value={c.participantId}>
                  #{c.rank} {c.participantName} — {c.poetryTitle} ({c.weightedScore} pts)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2nd Prize */}
        <div className="admin-card" style={{ border: '2px solid #94a3b8', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Trophy size={22} color="#64748b" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#334155', margin: 0 }}>
              2nd Prize Winner
            </h3>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#475569' }}>NPR 2,000</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              DOBATO Trophy + DOBATO T-shirt + 6 Months Free Access
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Select Participant</label>
            <select
              className="admin-select"
              value={secondId}
              disabled={isLocked}
              onChange={(e) => setSecondId(e.target.value)}
            >
              <option value="">-- Choose 2nd Place Winner --</option>
              {candidates.map((c) => (
                <option key={c.participantId} value={c.participantId}>
                  #{c.rank} {c.participantName} — {c.poetryTitle} ({c.weightedScore} pts)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3rd Prize */}
        <div className="admin-card" style={{ border: '2px solid #d97706', backgroundColor: '#fffbe8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Trophy size={22} color="#b45309" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
              3rd Prize Winner
            </h3>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #fef3c7', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#b45309' }}>
              3 Months Free Access
            </div>
            <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>
              DOBATO Trophy + DOBATO T-shirt
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Select Participant</label>
            <select
              className="admin-select"
              value={thirdId}
              disabled={isLocked}
              onChange={(e) => setThirdId(e.target.value)}
            >
              <option value="">-- Choose 3rd Place Winner --</option>
              {candidates.map((c) => (
                <option key={c.participantId} value={c.participantId}>
                  #{c.rank} {c.participantName} — {c.poetryTitle} ({c.weightedScore} pts)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isLocked && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="admin-btn admin-btn-secondary"
            style={{ height: '44px' }}
            onClick={handleSaveSelection}
            disabled={saving}
          >
            <span>Save Winner Selection Draft</span>
          </button>

          <button
            className="admin-btn admin-btn-primary"
            style={{ height: '44px', backgroundColor: '#16a34a' }}
            onClick={() => setShowConfirmModal(true)}
            disabled={saving || !firstId || !secondId || !thirdId}
          >
            <ShieldCheck size={18} />
            <span>Review & Finalize Results</span>
          </button>
        </div>
      )}

      {/* Finalize Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="admin-card"
            style={{ maxWidth: '500px', width: '100%', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <AlertTriangle size={48} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Finalize Competition Results?
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                Once results are finalized, judging scores and winner selection will be locked permanently.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Selected Winners Review:</div>
              <div>🥇 1st: <strong>{buildSlot(firstId, '')?.participantName || 'Unassigned'}</strong></div>
              <div>🥈 2nd: <strong>{buildSlot(secondId, '')?.participantName || 'Unassigned'}</strong></div>
              <div>🥉 3rd: <strong>{buildSlot(thirdId, '')?.participantName || 'Unassigned'}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                style={{ backgroundColor: '#16a34a' }}
                onClick={handleFinalizeResults}
                disabled={saving}
              >
                {saving ? 'Finalizing...' : 'Finalize Results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
