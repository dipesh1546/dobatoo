import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Feather,
  Music,
  BookOpen,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import type {
  DashboardStats,
  EventStats,
  RegistrationChartDataPoint,
  RegistrationDetails,
} from '../../types/admin';
import { adminStatsService } from '../../services/admin/adminStatsService';
import { adminEventService } from '../../services/admin/adminEventService';
import { adminRegistrationService } from '../../services/admin/adminRegistrationService';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [eventStats, setEventStats] = useState<EventStats | null>(null);

  const [chartData, setChartData] = useState<RegistrationChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationDetails[]>([]);
  const [recentRegsLoading, setRecentRegsLoading] = useState(true);
  const [recentRegsError, setRecentRegsError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setStatsLoading(true);
    setChartLoading(true);
    setRecentRegsLoading(true);
    setIsRefreshing(true);

    const [statsRes, eventRes, chartRes, regRes] = await Promise.allSettled([
      adminStatsService.getDashboardStats(),
      adminEventService.getEventStats(),
      adminStatsService.getRegistrationChartStats(),
      adminRegistrationService.getRegistrations({ limit: 5 }),
    ]);

    // 1. Process Stats
    if (statsRes.status === 'fulfilled' && statsRes.value.success && statsRes.value.data) {
      setStats(statsRes.value.data);
      setStatsError(null);
    } else {
      const errMessage =
        statsRes.status === 'fulfilled'
          ? statsRes.value.message || 'Unable to load statistics'
          : 'Unable to connect to statistics service';
      setStatsError(errMessage);
    }
    setStatsLoading(false);

    // 2. Process Event
    if (eventRes.status === 'fulfilled' && eventRes.value.success && eventRes.value.data) {
      setEventStats(eventRes.value.data);
    }

    // 3. Process Chart
    if (chartRes.status === 'fulfilled' && chartRes.value.success && chartRes.value.data) {
      const safeData = Array.isArray(chartRes.value.data) ? chartRes.value.data : [];
      setChartData(safeData);
      setChartError(null);
    } else {
      const errMessage =
        chartRes.status === 'fulfilled'
          ? chartRes.value.message || 'Unable to load registration analytics'
          : 'Unable to connect to analytics service';
      setChartError(errMessage);
    }
    setChartLoading(false);

    // 4. Process Recent Registrations
    if (regRes.status === 'fulfilled' && regRes.value.success && regRes.value.data) {
      const items = Array.isArray(regRes.value.data.items)
        ? regRes.value.data.items
        : Array.isArray(regRes.value.data)
        ? (regRes.value.data as any)
        : [];
      setRecentRegistrations(items);
      setRecentRegsError(null);
    } else {
      const errMessage =
        regRes.status === 'fulfilled'
          ? regRes.value.message || 'No registration data available'
          : 'Unable to connect to registration service';
      setRecentRegsError(errMessage);
    }
    setRecentRegsLoading(false);

    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Admin.';
    if (hour < 18) return 'Good afternoon, Admin.';
    return 'Good evening, Admin.';
  };

  const safeChartData = Array.isArray(chartData) ? chartData : [];
  const maxChartCount = Math.max(...safeChartData.map((d) => d.count), 1);
  const safeRecentRegistrations = Array.isArray(recentRegistrations) ? recentRegistrations : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Greeting & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {getGreeting()}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Dobatoo Grand Launch • Open Mic participant overview
          </p>
        </div>
        <button
          onClick={() => loadDashboardData()}
          disabled={isRefreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#475569',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease',
          }}
          title="Refresh Dashboard Data"
        >
          <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Error Banner if statistics failed */}
      {statsError && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{statsError}</span>
        </div>
      )}

      {/* Recommended 5 Cards Grid: Performance Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Total Registrations</div>
            <Users size={18} color="#7c3aed" />
          </div>
          <div className="admin-stat-value">{statsLoading ? '...' : (stats?.totalRegistrations ?? 0)}</div>
          <div className="admin-stat-sub">Official Participants</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Poetry Participants</div>
            <Feather size={18} color="#db2777" />
          </div>
          <div className="admin-stat-value" style={{ color: '#db2777' }}>
            {statsLoading ? '...' : (stats?.poetryParticipants ?? 0)}
          </div>
          <div className="admin-stat-sub">Theme: DOBATO</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Music Participants</div>
            <Music size={18} color="#0284c7" />
          </div>
          <div className="admin-stat-value" style={{ color: '#0284c7' }}>
            {statsLoading ? '...' : (stats?.musicParticipants ?? 0)}
          </div>
          <div className="admin-stat-sub">Acoustic & Recital</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Storytelling</div>
            <BookOpen size={18} color="#d97706" />
          </div>
          <div className="admin-stat-value" style={{ color: '#d97706' }}>
            {statsLoading ? '...' : (stats?.storytellingParticipants ?? 0)}
          </div>
          <div className="admin-stat-sub">Narratives & Stories</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-stat-label">Audience Attendees</div>
            <Sparkles size={18} color="#475569" />
          </div>
          <div className="admin-stat-value" style={{ color: '#475569' }}>
            {statsLoading ? '...' : (stats?.attendOnly ?? 0)}
          </div>
          <div className="admin-stat-sub">Attend Only</div>
        </div>
      </div>

      {/* Main Grid: Event Overview Card + Registrations Chart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Event Operational Status Card */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Dobatoo Grand Launch
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                Open Mic Event Overview
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: eventStats?.status === 'OPEN' ? '#dcfce7' : '#fee2e2',
                color: eventStats?.status === 'OPEN' ? '#15803d' : '#991b1b',
              }}
            >
              {eventStats?.status || 'REGISTRATION OPEN'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EVENT FORMAT</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#db2777', marginTop: '0.125rem' }}>
                OPEN MIC
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>POETRY THEME</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.125rem' }}>
                DOBATO
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PERFORMANCE RULE</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginTop: '0.125rem' }}>
                5 Mins / No Age Limit
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DATE & VENUE</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>
                16 Oct 2026 • The Gardens
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
            <Link to="/admin/registrations" style={{ flex: 1, textDecoration: 'none' }}>
              <button
                className="admin-btn admin-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Users size={16} />
                <span>View Registrations</span>
              </button>
            </Link>

            <Link to="/admin/poetry" style={{ flex: 1, textDecoration: 'none' }}>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Feather size={16} />
                <span>Poetry Panel</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Registration Trend Chart Card */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Registration Trend
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                Daily registration momentum
              </p>
            </div>
            <TrendingUp size={18} color="#7c3aed" />
          </div>

          {chartLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: '#64748b' }}>
              Loading registration analytics...
            </div>
          ) : chartError ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: '#b91c1c', fontSize: '0.875rem' }}>
              {chartError}
            </div>
          ) : safeChartData.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: '#64748b', fontSize: '0.875rem' }}>
              No registration history recorded yet.
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '0.75rem',
                minHeight: '160px',
                paddingTop: '1rem',
              }}
            >
              {safeChartData.map((dp, i) => {
                const heightPercent = Math.max(12, Math.round((dp.count / maxChartCount) * 100));
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>
                      {dp.count}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '38px',
                        height: `${heightPercent}%`,
                        backgroundColor: '#c084fc',
                        background: 'linear-gradient(180deg, #7c3aed 0%, #c084fc 100%)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {dp.date}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Recent Registrations
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              Latest participants registered for Dobatoo Open Mic
            </p>
          </div>
          <Link
            to="/admin/registrations"
            className="admin-btn admin-btn-secondary"
            style={{ textDecoration: 'none', height: '36px', fontSize: '0.8125rem' }}
          >
            View All Registrations
          </Link>
        </div>

        <div className="admin-table-container" style={{ border: 'none', borderRadius: '0 0 10px 10px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Participant Name</th>
                <th>Type</th>
                <th>Stage Name</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRegsLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    Loading recent registrations...
                  </td>
                </tr>
              ) : recentRegsError ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#b91c1c', padding: '2rem', backgroundColor: '#fef2f2' }}>
                    {recentRegsError}
                  </td>
                </tr>
              ) : safeRecentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    No recent registrations found.
                  </td>
                </tr>
              ) : (
                safeRecentRegistrations.map((reg) => {
                  const regId = reg.registrationId || reg.id;
                  const isPerformer = reg.participationType === 'ATTEND_AND_POETRY';
                  const stage = reg.performance?.stageIntroductionName || reg.stageIntroductionName;
                  const perfType = reg.performance?.performanceType || reg.performanceType;

                  return (
                    <tr key={reg.id || reg.registrationId}>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#7c3aed' }}>
                            {regId}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(regId, e)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === regId ? '#16a34a' : '#94a3b8' }}
                          >
                            {copiedId === regId ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {reg.photoUrl ? (
                            <img
                              src={reg.photoUrl}
                              alt=""
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#f1f5f9',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                flexShrink: 0,
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              {reg.fullName ? reg.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <span>{reg.fullName}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: isPerformer ? '#fdf2f8' : '#f1f5f9',
                            color: isPerformer ? '#db2777' : '#475569',
                          }}
                        >
                          {isPerformer ? (perfType ? perfType.replace(/_/g, ' ') : 'Performer') : 'Audience'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: stage ? '#0f172a' : '#94a3b8', fontWeight: stage ? 600 : 400 }}>
                        {stage || '—'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-admin-status ${(reg.status || 'REGISTERED').toLowerCase().replace('_', '-')}`}>
                          {reg.status || 'REGISTERED'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
