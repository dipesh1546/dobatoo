import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Feather,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Award,
  Copy,
  Check,
} from 'lucide-react';
import type { PoetryParticipantDetail, PoetryStats } from '../../types/poetryJudging';
import { poetryAdminService } from '../../services/admin/poetryAdminService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<PoetryStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filters (no checkInStatus filter)
  const [language, setLanguage] = useState('ALL');
  const [performanceType, setPerformanceType] = useState('ALL');
  const [reviewStatus, setReviewStatus] = useState<'ALL' | 'REVIEWED' | 'PENDING' | 'NEEDS_ATTENTION'>('ALL');
  const [judgingStatus, setJudgingStatus] = useState<'ALL' | 'JUDGED' | 'PENDING'>('ALL');

  // Table & Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [participants, setParticipants] = useState<PoetryParticipantDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        poetryAdminService.getStats(),
        poetryAdminService.getParticipants({
          search: debouncedSearch,
          language,
          performanceType,
          reviewStatus,
          judgingStatus,
          page,
          limit,
        }),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (listRes.data) {
        setParticipants(listRes.data.items);
        setTotal(listRes.data.total);
        setTotalPages(listRes.data.totalPages);
      }
    } catch (err) {
      console.error('Error loading poetry competition data:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, language, performanceType, reviewStatus, judgingStatus, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Poetry & Performance Management
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.05em' }}>
              POETRY THEME:
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#db2777', backgroundColor: '#fdf2f8', padding: '0.15rem 0.6rem', borderRadius: '4px', border: '1px solid #fbcfe8' }}>
              DOBATO
            </span>
          </div>
        </div>

        <button className="admin-btn admin-btn-secondary" onClick={() => loadData()}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <PoetryNavTabs />

      {/* 5 Statistics Cards Grid (No check-in cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Total Performers</div>
            <Feather size={16} color="#7c3aed" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{loading ? '...' : stats?.totalParticipants ?? 0}</div>
          <div className="admin-stat-sub">Theme: DOBATO</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Entries Reviewed</div>
            <CheckCircle2 size={16} color="#0284c7" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.5rem', color: '#0284c7' }}>
            {loading ? '...' : stats?.entriesReviewed ?? 0}
          </div>
          <div className="admin-stat-sub">Screened Submissions</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Pending Review</div>
            <Clock size={16} color="#d97706" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.5rem', color: '#d97706' }}>
            {loading ? '...' : stats?.entriesPending ?? 0}
          </div>
          <div className="admin-stat-sub">Awaiting Screening</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Judged / Scored</div>
            <Award size={16} color="#16a34a" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
            {loading ? '...' : stats?.judged ?? 0}
          </div>
          <div className="admin-stat-sub">Scores Recorded</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Pending Judging</div>
            <Clock size={16} color="#7c3aed" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.5rem', color: '#7c3aed' }}>
            {loading ? '...' : stats?.pendingJudging ?? 0}
          </div>
          <div className="admin-stat-sub">To Be Evaluated</div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search by Registration ID, Participant Name, or Poetry Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        {/* Filter Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="admin-form-group">
            <label className="admin-label">Language</label>
            <select
              className="admin-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Languages</option>
              <option value="NEPALI">Nepali</option>
              <option value="ENGLISH">English</option>
              <option value="MIXED">Mixed / Both</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Performance Format</label>
            <select
              className="admin-select"
              value={performanceType}
              onChange={(e) => {
                setPerformanceType(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Formats</option>
              <option value="ORIGINAL_POETRY">Original Poetry</option>
              <option value="SPOKEN_WORD">Spoken Word</option>
              <option value="MUSICAL_POETRY">Musical Poetry</option>
              <option value="RECITAL">Recital</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Review Status</label>
            <select
              className="admin-select"
              value={reviewStatus}
              onChange={(e) => {
                setReviewStatus(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="ALL">All Reviews</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="PENDING">Pending</option>
              <option value="NEEDS_ATTENTION">Needs Attention</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Judging Status</label>
            <select
              className="admin-select"
              value={judgingStatus}
              onChange={(e) => {
                setJudgingStatus(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="ALL">All Judging States</option>
              <option value="SCORED">Scored</option>
              <option value="PENDING">Pending Judging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Participant</th>
                <th>Poetry Theme</th>
                <th>Title / Notes</th>
                <th>Format</th>
                <th>Submission Date</th>
                <th>Review</th>
                <th>Judging</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading poetry entries...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No entries found matching filters.
                  </td>
                </tr>
              ) : (
                participants.map((p) => {
                  const regId = p.registrationId || p.id;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#7c3aed' }}>
                            {regId}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(regId, e)}
                            title="Copy Registration ID"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === regId ? '#16a34a' : '#94a3b8' }}
                          >
                            {copiedId === regId ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{p.participantName}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#db2777' }}>
                          DOBATO
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                          {p.poetryTitle || 'Open Mic Recital'}
                        </div>
                        {p.description && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                          {p.performanceType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor:
                              p.reviewStatus === 'REVIEWED' ? '#dcfce7' : p.reviewStatus === 'NEEDS_ATTENTION' ? '#fee2e2' : '#fef3c7',
                            color:
                              p.reviewStatus === 'REVIEWED' ? '#15803d' : p.reviewStatus === 'NEEDS_ATTENTION' ? '#991b1b' : '#92400e',
                          }}
                        >
                          {p.reviewStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: p.judgingStatus === 'SCORED' ? '#dcfce7' : '#f1f5f9',
                            color: p.judgingStatus === 'SCORED' ? '#15803d' : '#475569',
                          }}
                        >
                          {p.judgingStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.75rem' }}
                          onClick={() => navigate(`/admin/poetry/${p.id}`)}
                        >
                          <Eye size={13} />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing <strong>{participants.length}</strong> of <strong>{total}</strong> entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="admin-btn admin-btn-secondary"
              style={{ height: '34px', padding: '0 0.75rem' }}
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem', color: '#0f172a' }}>
              Page {page} of {totalPages}
            </span>

            <button
              className="admin-btn admin-btn-secondary"
              style={{ height: '34px', padding: '0 0.75rem' }}
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
