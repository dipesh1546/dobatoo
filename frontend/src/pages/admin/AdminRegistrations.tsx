import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserPlus,
  Copy,
  Check,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type {
  RegistrationDetails,
  ParticipationFilter,
  StatusFilter,
  DateRangeFilter,
} from '../../types/admin';
import type { PerformanceType, GenderType, DiscoverySource, ParticipationType } from '../../types/api';
import { adminRegistrationService } from '../../services/admin/adminRegistrationService';

export const AdminRegistrationsPage: React.FC = () => {
  const navigate = useNavigate();

  // Search state with debounce
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filters state
  const [participation, setParticipation] = useState<ParticipationFilter>('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [dateRange, setDateRange] = useState<DateRangeFilter>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Table & Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [registrations, setRegistrations] = useState<RegistrationDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Copy registration ID state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; regId?: string } | null>(null);

  // Add User Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<GenderType>('OTHER');
  const [participationType, setParticipationType] = useState<ParticipationType>('ATTEND_AND_POETRY');
  const [performanceType, setPerformanceType] = useState<PerformanceType>('POETRY');
  const [stageName, setStageName] = useState('');
  const [performanceNotes, setPerformanceNotes] = useState('');
  const [discoverySource, setDiscoverySource] = useState<DiscoverySource>('INSTAGRAM');
  const [discoverySourceOther, setDiscoverySourceOther] = useState('');

  // Search debounce timer effect (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await adminRegistrationService.getRegistrations({
        search: debouncedSearch,
        participation,
        status,
        dateRange,
        startDate: dateRange === 'CUSTOM' ? startDate : undefined,
        endDate: dateRange === 'CUSTOM' ? endDate : undefined,
        page,
        limit,
      });

      if (res.success && res.data) {
        const items = Array.isArray(res.data.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? (res.data as any)
          : [];
        setRegistrations(items);
        setTotal(res.data.total ?? items.length);
        setTotalPages(res.data.totalPages ?? 1);
      } else {
        setLoadError(res.message || 'Failed to load registrations.');
        setRegistrations([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('Failed to load registrations:', err);
      setLoadError(err?.message || 'Failed to load registrations.');
      setRegistrations([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, participation, status, dateRange, startDate, endDate, page, limit]);

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

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    setSubmittingUser(true);
    setNotification(null);

    const isPerformer = participationType === 'ATTEND_AND_POETRY';
    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      participationType,
      discoverySource,
      discoverySourceOther: discoverySource === 'OTHERS' ? discoverySourceOther.trim() : undefined,
      stageIntroductionName: isPerformer ? stageName.trim() || fullName.trim() : undefined,
      performanceType: isPerformer ? performanceType : undefined,
      performanceDescription: isPerformer ? performanceNotes.trim() || undefined : undefined,
      topic: isPerformer ? 'DOBATO' : undefined,
      mediaAgreement: true,
    };

    try {
      const res = await adminRegistrationService.createRegistration(payload);
      if (res.success && res.data) {
        setNotification({
          type: 'success',
          message: `Participant created successfully! Registration ID: ${res.data.registrationId || res.data.id}`,
          regId: res.data.registrationId || res.data.id,
        });
        // Reset form
        setFullName('');
        setEmail('');
        setPhone('');
        setStageName('');
        setPerformanceNotes('');
        setDiscoverySourceOther('');
        setShowAddModal(false);
        loadData();
      } else {
        setNotification({
          type: 'error',
          message: res.message || 'Failed to create participant registration.',
        });
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'An error occurred while creating the registration.',
      });
    } finally {
      setSubmittingUser(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Registered Participants
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            DOBATO Open Mic Event participant directory & management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => loadData()}
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddModal(true)}
            title="Manually Register Participant"
          >
            <UserPlus size={16} />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: notification.type === 'success' ? '#15803d' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          {notification.regId && (
            <button
              onClick={(e) => handleCopyId(notification.regId!, e)}
              className="admin-btn admin-btn-secondary"
              style={{ height: '28px', padding: '0 0.5rem', fontSize: '0.75rem' }}
            >
              {copiedId === notification.regId ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedId === notification.regId ? 'Copied' : 'Copy ID'}</span>
            </button>
          )}
        </div>
      )}

      {/* Search and Filters Card */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search by Registration ID, Name, Email, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
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
            <label className="admin-label">Participation Type</label>
            <select
              className="admin-select"
              value={participation}
              onChange={(e) => {
                setParticipation(e.target.value as ParticipationFilter);
                setPage(1);
              }}
            >
              <option value="ALL">All Participation Types</option>
              <option value="ATTEND_AND_POETRY">Open Mic Performer</option>
              <option value="ATTEND_ONLY">Audience (Attend Only)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Status</label>
            <select
              className="admin-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Registration Date</label>
            <select
              className="admin-select"
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value as DateRangeFilter);
                setPage(1);
              }}
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="CUSTOM">Custom Date Range</option>
            </select>
          </div>

          {dateRange === 'CUSTOM' && (
            <>
              <div className="admin-form-group">
                <label className="admin-label">Start Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">End Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="admin-card hide-mobile" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Performance Type</th>
                <th>Stage Name</th>
                <th>Poetry Theme</th>
                <th>Source</th>
                <th>Registered At</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading participant registrations...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <span>Failed to load registrations: {loadError}</span>
                      <button className="admin-btn admin-btn-secondary" onClick={() => loadData()}>
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const regId = reg.registrationId || reg.id;
                  const isPerformer = reg.participationType === 'ATTEND_AND_POETRY';
                  const perfType = reg.performance?.performanceType || reg.performanceType;
                  const stage = reg.performance?.stageIntroductionName || reg.stageIntroductionName;

                  return (
                    <tr key={reg.id}>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontFamily: 'monospace',
                              color: '#7c3aed',
                              fontSize: '0.875rem',
                              letterSpacing: '0.03em',
                            }}
                          >
                            {regId}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(regId, e)}
                            title="Copy Registration ID"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: copiedId === regId ? '#16a34a' : '#94a3b8',
                              display: 'inline-flex',
                            }}
                          >
                            {copiedId === regId ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {reg.fullName}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                          <div>{reg.email}</div>
                          <div style={{ color: '#64748b' }}>{reg.phone}</div>
                        </div>
                      </td>
                      <td>
                        {isPerformer ? (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              backgroundColor: '#fdf2f8',
                              color: '#db2777',
                            }}
                          >
                            {perfType ? perfType.replace(/_/g, ' ') : 'Performer'}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: isPerformer && stage ? '#0f172a' : '#94a3b8', fontWeight: isPerformer && stage ? 600 : 400 }}>
                        {isPerformer ? (stage || '—') : '—'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: isPerformer ? '#7c3aed' : '#94a3b8', fontWeight: isPerformer ? 700 : 400 }}>
                          {isPerformer ? 'DOBATO' : '—'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {reg.discoverySource === 'OTHERS'
                          ? `Other (${reg.discoverySourceOther || ''})`
                          : reg.discoverySource || '—'}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                        {new Date(reg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <span className={`badge-admin-status ${(reg.status || 'REGISTERED').toLowerCase().replace('_', '-')}`}>
                          {reg.status || 'REGISTERED'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.75rem' }}
                          onClick={() => navigate(`/admin/registrations/${regId}`)}
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
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
            Showing <strong>{registrations.length}</strong> of <strong>{total}</strong> registrations
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

      {/* Mobile Responsive Cards View */}
      <div className="show-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
            Loading participants...
          </div>
        ) : loadError ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#dc2626' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span>Failed to load registrations: {loadError}</span>
              <button className="admin-btn admin-btn-secondary" onClick={() => loadData()}>
                Retry
              </button>
            </div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
            No registrations found matching criteria.
          </div>
        ) : (
          registrations.map((reg) => {
            const regId = reg.registrationId || reg.id;
            const isPerformer = reg.participationType === 'ATTEND_AND_POETRY';
            const perfType = reg.performance?.performanceType || reg.performanceType;
            const stage = reg.performance?.stageIntroductionName || reg.stageIntroductionName;

            return (
              <div key={reg.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REGISTRATION ID</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace', color: '#7c3aed' }}>
                        {regId}
                      </span>
                      <button
                        onClick={(e) => handleCopyId(regId, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === regId ? '#16a34a' : '#94a3b8' }}
                      >
                        {copiedId === regId ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <span className={`badge-admin-status ${(reg.status || 'REGISTERED').toLowerCase().replace('_', '-')}`}>
                    {reg.status || 'REGISTERED'}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{reg.fullName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>{reg.email} • {reg.phone}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>PERFORMANCE TYPE</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isPerformer ? '#db2777' : '#64748b' }}>
                      {isPerformer ? (perfType ? perfType.replace(/_/g, ' ') : 'Performer') : '—'}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>STAGE NAME</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: isPerformer && stage ? 600 : 400, color: isPerformer && stage ? '#0f172a' : '#94a3b8' }}>
                      {isPerformer ? (stage || '—') : '—'}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>POETRY THEME</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: isPerformer ? 800 : 400, color: isPerformer ? '#7c3aed' : '#94a3b8' }}>
                      {isPerformer ? 'DOBATO' : '—'}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>DATE</span>
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate(`/admin/registrations/${regId}`)}
                >
                  <Eye size={14} />
                  <span>View Complete Details</span>
                </button>
              </div>
            );
          })
        )}

        {/* Mobile Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem' }}>
          <button
            className="admin-btn admin-btn-secondary"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
          <button
            className="admin-btn admin-btn-secondary"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* + Add User Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add Participant Registration
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Register a participant manually using the official registration architecture
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Sujan Shrestha"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    placeholder="sujan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="admin-input"
                    placeholder="+977 98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Gender</label>
                  <select
                    className="admin-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderType)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Participation Type</label>
                <select
                  className="admin-select"
                  value={participationType}
                  onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                >
                  <option value="ATTEND_AND_POETRY">Open Mic Performer (Poetry / Music / Storytelling)</option>
                  <option value="ATTEND_ONLY">Audience (Attend Only)</option>
                </select>
              </div>

              {participationType === 'ATTEND_AND_POETRY' && (
                <div
                  style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed' }}>
                      PERFORMANCE DETAILS
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', backgroundColor: '#f3e8ff', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      THEME: DOBATO
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Performance Type *</label>
                      <select
                        className="admin-select"
                        value={performanceType}
                        onChange={(e) => setPerformanceType(e.target.value as PerformanceType)}
                      >
                        <option value="POETRY">Poetry</option>
                        <option value="STORY_TELLING">Story Telling</option>
                        <option value="MUSIC">Music</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Stage Name / Introduction *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        placeholder="Stage name or full name"
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Performance Notes / Description (Optional)</label>
                    <textarea
                      rows={2}
                      className="admin-input"
                      placeholder="Brief notes on performance..."
                      value={performanceNotes}
                      onChange={(e) => setPerformanceNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Where did they find this event?</label>
                  <select
                    className="admin-select"
                    value={discoverySource}
                    onChange={(e) => setDiscoverySource(e.target.value as DiscoverySource)}
                  >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="FRIENDS">Friends & Family</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>

                {discoverySource === 'OTHERS' && (
                  <div className="admin-form-group">
                    <label className="admin-label">Specify Source *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="e.g. Word of mouth"
                      value={discoverySourceOther}
                      onChange={(e) => setDiscoverySourceOther(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="admin-btn admin-btn-primary"
                >
                  {submittingUser ? 'Registering...' : '+ Create Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
