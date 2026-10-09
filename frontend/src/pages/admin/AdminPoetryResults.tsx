import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  AlertTriangle,
  RefreshCw,
  History,
} from 'lucide-react';
import type { ScoreSummary, CompetitionStatus, AuditLog } from '../../types/poetryJudging';
import { resultsService } from '../../services/admin/resultsService';
import { poetryAdminService } from '../../services/admin/poetryAdminService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryResultsPage: React.FC = () => {
  const navigate = useNavigate();

  const [results, setResults] = useState<ScoreSummary[]>([]);
  const [compStatus, setCompStatus] = useState<CompetitionStatus>('JUDGING');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadResultsData = async () => {
    setLoading(true);
    try {
      const [resData, compData, auditData] = await Promise.all([
        resultsService.getResults(),
        poetryAdminService.getCompetition(),
        poetryAdminService.getAuditLogs(),
      ]);

      if (resData.data) setResults(resData.data);
      if (compData.data) setCompStatus(compData.data.status);
      if (auditData.data) setAuditLogs(auditData.data);
    } catch (err) {
      console.error('Failed loading competition results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResultsData();
  }, []);

  const handleStatusChange = async (newStatus: CompetitionStatus) => {
    try {
      const res = await poetryAdminService.updateCompetitionStatus(newStatus);
      if (res.success && res.data) {
        setCompStatus(res.data.status);
        setStatusMsg(`Competition status updated to ${newStatus} ✓`);
        loadResultsData();
      }
    } catch {
      setStatusMsg('Failed updating competition status.');
    }
  };

  const hasAnyTie = results.some((r) => r.hasTie);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Competition Results & Rankings
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Weighted scores aggregated across judge panel evaluations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => loadResultsData()}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Recalculate</span>
          </button>

          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/poetry/winners')}>
            <Trophy size={16} />
            <span>Winner Selection</span>
          </button>
        </div>
      </div>

      <PoetryNavTabs />

      {/* Competition Status Lifecycle Control Panel */}
      <div className="admin-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              CURRENT COMPETITION LIFECYCLE STATE
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.25rem' }}>
              {compStatus} {compStatus === 'FINALIZED' ? '🔒 (LOCKED)' : ''}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`admin-btn ${compStatus === 'OPEN' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ height: '34px', fontSize: '0.75rem' }}
              disabled={compStatus === 'FINALIZED'}
              onClick={() => handleStatusChange('OPEN')}
            >
              Set OPEN
            </button>
            <button
              className={`admin-btn ${compStatus === 'JUDGING' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ height: '34px', fontSize: '0.75rem' }}
              disabled={compStatus === 'FINALIZED'}
              onClick={() => handleStatusChange('JUDGING')}
            >
              Set JUDGING
            </button>
            <button
              className={`admin-btn ${compStatus === 'FINAL_REVIEW' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ height: '34px', fontSize: '0.75rem' }}
              disabled={compStatus === 'FINALIZED'}
              onClick={() => handleStatusChange('FINAL_REVIEW')}
            >
              Set FINAL REVIEW
            </button>
          </div>
        </div>

        {statusMsg && (
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
            {statusMsg}
          </div>
        )}
      </div>

      {/* Tie Warning Banner */}
      {hasAnyTie && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700,
            fontSize: '0.9375rem',
          }}
        >
          <AlertTriangle size={22} color="#d97706" />
          <span>Tie requires organizer review. One or more participants share an identical weighted score.</span>
        </div>
      )}

      {/* Results Leaderboard Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Registration ID</th>
                <th>Participant Name</th>
                <th>Poetry Title</th>
                <th>Judges Count</th>
                <th>Weighted Score</th>
                <th>Status / Tie Check</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Calculating results...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No scores submitted yet.
                  </td>
                </tr>
              ) : (
                results.map((r, idx) => (
                  <tr
                    key={r.participantId}
                    style={{
                      backgroundColor: idx === 0 ? '#fcf6ff' : idx === 1 ? '#f8fafc' : idx === 2 ? '#fffbeb' : 'transparent',
                    }}
                  >
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          fontWeight: 800,
                          fontSize: '0.8125rem',
                          backgroundColor: idx === 0 ? '#7c3aed' : idx === 1 ? '#0284c7' : idx === 2 ? '#d97706' : '#f1f5f9',
                          color: idx < 3 ? '#ffffff' : '#475569',
                        }}
                      >
                        {r.rank || idx + 1}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#7c3aed' }}>
                      {r.registrationId}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.participantName}</td>
                    <td style={{ fontWeight: 600, color: '#4c1d95' }}>{r.poetryTitle}</td>
                    <td style={{ fontWeight: 600 }}>{r.judgesCount} judges</td>
                    <td style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                      {r.weightedScore.toFixed(2)} / 100
                    </td>
                    <td>
                      {r.hasTie ? (
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          ⚠️ TIE DETECTED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>
                          ✓ Valid Score
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Audit History Logs */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <History size={18} color="#7c3aed" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Competition Audit Log History
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.8125rem',
              }}
            >
              <div>
                <strong style={{ color: '#0f172a' }}>{log.action}</strong> • <span style={{ color: '#64748b' }}>{log.details}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                {log.actor} • {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
