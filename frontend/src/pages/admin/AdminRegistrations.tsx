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
  CreditCard,
  Upload,
  Trash2,
  Loader2,
} from 'lucide-react';
import type {
  RegistrationDetails,
  ParticipationFilter,
  StatusFilter,
  DateRangeFilter,
} from '../../types/admin';
import type { PerformanceType, GenderType, DiscoverySource, ParticipationType } from '../../types/api';
import { adminRegistrationService } from '../../services/admin/adminRegistrationService';
import { registrationService } from '../../services/registrationService';
import { ParticipantIdCardModal } from '../../components/admin/idCard';

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

  // ID Card Modal & Selection State
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedForCard, setSelectedForCard] = useState<RegistrationDetails | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = registrations.map((r) => r.registrationId || r.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; regId?: string } | null>(null);

  // Add User Form Fields & Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<string | null>(null);
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

  const resetAddForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setGender('OTHER');
    setParticipationType('ATTEND_AND_POETRY');
    setPerformanceType('POETRY');
    setStageName('');
    setPerformanceNotes('');
    setDiscoverySource('INSTAGRAM');
    setDiscoverySourceOther('');
    setAddPhotoUrl('');
    setAddPhotoPreview(null);
    setAddPhotoError(null);
    setFormErrors({});
    setModalError(null);
  };

  // Add User Photo State
  const [addPhotoUrl, setAddPhotoUrl] = useState('');
  const [addPhotoPreview, setAddPhotoPreview] = useState<string | null>(null);
  const [isUploadingAddPhoto, setIsUploadingAddPhoto] = useState(false);
  const [addPhotoError, setAddPhotoError] = useState<string | null>(null);

  const handleAddPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif|jpg)$/i)) {
      setAddPhotoError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAddPhotoError('Image size must be less than 5MB.');
      return;
    }

    setAddPhotoError(null);
    const localUrl = URL.createObjectURL(file);
    setAddPhotoPreview(localUrl);
    setIsUploadingAddPhoto(true);

    const result = await registrationService.uploadPhoto(file);
    setIsUploadingAddPhoto(false);

    if (result.success && result.url) {
      setAddPhotoUrl(result.url);
    } else {
      setAddPhotoError(result.error || 'Upload failed. You can still proceed without photo.');
    }
  };

  const handleRemoveAddPhoto = () => {
    setAddPhotoUrl('');
    setAddPhotoPreview(null);
    setAddPhotoError(null);
  };

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
    setModalError(null);

    const isPerformer = participationType === 'ATTEND_AND_POETRY';
    // If admin filled stageName (e.g. ankit) but not fullName, safely fallback to stageName
    const resolvedFullName = fullName.trim() || (isPerformer ? stageName.trim() : '');
    const errors: Record<string, string> = {};

    if (!resolvedFullName) {
      errors.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. participant@example.com).';
    }

    const phoneClean = phone.replace(/[\s-]/g, '');
    // Supports Nepal mobile numbers starting with 98 or 97 (10 digits or with +977) and international formats
    const phoneRegex = /^(\+?977)?[9][6-8]\d{8}$|^\+?\d{7,15}$/;
    if (!phoneClean) {
      errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(phoneClean)) {
      errors.phone = 'Phone number must be a valid mobile number (e.g. 98XXXXXXXX, 97XXXXXXXX, or +977 98/97...).';
    }

    if (isPerformer && !stageName.trim() && !fullName.trim()) {
      errors.stageName = 'Stage Name or Introduction is required.';
    }

    if (discoverySource === 'OTHERS' && !discoverySourceOther.trim()) {
      errors.discoverySourceOther = 'Please specify discovery source.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setModalError('Please fill out all required fields marked below.');
      return;
    }

    setSubmittingUser(true);
    setNotification(null);

    const payload = {
      fullName: resolvedFullName,
      email: email.trim().toLowerCase(),
      phone: phoneClean,
      gender,
      photoUrl: addPhotoUrl.trim() || undefined,
      participationType,
      discoverySource,
      discoverySourceOther: discoverySource === 'OTHERS' ? discoverySourceOther.trim() : undefined,
      stageIntroductionName: isPerformer ? (stageName.trim() || resolvedFullName) : undefined,
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
        resetAddForm();
        setShowAddModal(false);
        loadData();
      } else {
        setModalError(res.message || 'Failed to create participant registration.');
      }
    } catch (err: any) {
      setModalError(err?.message || 'An error occurred while creating the registration.');
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
            Dobatoo Open Mic Event participant directory & management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              setSelectedForCard(null);
              setShowCardModal(true);
            }}
            title="Preview 3x4 Performer ID Card"
            style={{ borderColor: '#ec4899', color: '#db2777', fontWeight: 600 }}
          >
            <CreditCard size={16} color="#ec4899" />
            <span>ID Card Preview</span>
          </button>

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

      {/* Bulk Selection Bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#1e113a',
            border: '1px solid #a855f7',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <CheckCircle2 size={18} color="#ec4899" />
            <span><strong>{selectedIds.length}</strong> participants selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="admin-btn admin-btn-primary"
              style={{
                height: '34px',
                fontSize: '0.8rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                border: 'none',
                fontWeight: 700,
              }}
              onClick={() => {
                setSelectedForCard(null);
                setShowCardModal(true);
              }}
            >
              <CreditCard size={14} />
              <span>Print Selected ID Cards ({selectedIds.length})</span>
            </button>
            <button
              className="admin-btn admin-btn-secondary"
              style={{ height: '34px', fontSize: '0.8rem' }}
              onClick={() => setSelectedIds([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="admin-card hide-mobile" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '38px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={registrations.length > 0 && registrations.every((r) => selectedIds.includes(r.registrationId || r.id))}
                    onChange={handleSelectAll}
                    title="Select all on this page"
                    style={{ cursor: 'pointer' }}
                  />
                </th>
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
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading participant registrations...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
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
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
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
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(regId)}
                          onChange={() => handleToggleSelect(regId)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {reg.photoUrl ? (
                            <a
                              href={reg.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View uploaded photo"
                              style={{ display: 'inline-flex' }}
                            >
                              <img
                                src={reg.photoUrl}
                                alt=""
                                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #cbd5e1' }}
                              />
                            </a>
                          ) : (
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
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
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.75rem', borderColor: '#fbcfe8', color: '#db2777' }}
                            onClick={() => {
                              setSelectedForCard(reg);
                              setShowCardModal(true);
                            }}
                            title="View & Print ID Card"
                          >
                            <CreditCard size={13} color="#ec4899" />
                            <span>ID Card</span>
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.75rem' }}
                            onClick={() => navigate(`/admin/registrations/${regId}`)}
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>
                        </div>
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

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', borderColor: '#fbcfe8', color: '#db2777' }}
                    onClick={() => {
                      setSelectedForCard(reg);
                      setShowCardModal(true);
                    }}
                  >
                    <CreditCard size={14} color="#ec4899" />
                    <span>ID Card</span>
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => navigate(`/admin/registrations/${regId}`)}
                  >
                    <Eye size={14} />
                    <span>Details</span>
                  </button>
                </div>
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
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(3px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={20} color="#7c3aed" />
                  <span>Add Participant Registration</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', marginBottom: 0 }}>
                  Manually register participant or performer with full verification & DBT ID
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form
              onSubmit={handleAddUserSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  overflowY: 'auto',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.1rem',
                }}
              >
                {/* Modal Error Alert */}
                {modalError && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#991b1b',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#dc2626' }} />
                    <div style={{ flex: 1, fontWeight: 500 }}>
                      <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: '0.15rem' }}>Registration Error</div>
                      <div>{modalError}</div>
                    </div>
                  </div>
                )}

                {/* Section 1: Contact & Personal Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Rohan Shrestha"
                      value={fullName}
                      style={formErrors.fullName ? { borderColor: '#ef4444', backgroundColor: '#fff5f5' } : {}}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                    />
                    {formErrors.fullName && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 500 }}>
                        {formErrors.fullName}
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="rohan@example.com"
                      value={email}
                      style={formErrors.email ? { borderColor: '#ef4444', backgroundColor: '#fff5f5' } : {}}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                      }}
                    />
                    {formErrors.email && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 500 }}>
                        {formErrors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      className="admin-input"
                      placeholder="+977 98XXXXXXXX / 97XXXXXXXX"
                      value={phone}
                      style={formErrors.phone ? { borderColor: '#ef4444', backgroundColor: '#fff5f5' } : {}}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Accepts Nepal mobile numbers with <strong>98</strong> and <strong>97</strong> prefixes (e.g. 98XXXXXXXX, 97XXXXXXXX)
                    </div>
                    {formErrors.phone && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 500 }}>
                        {formErrors.phone}
                      </div>
                    )}
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

                {/* Section 2: Photo Upload Section */}
                <div className="admin-form-group">
                  <label className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Participant Photo</span>
                    <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.75rem' }}>
                      Optional (Appears on ID Card & Profile)
                    </span>
                  </label>

                  <div
                    style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {addPhotoPreview ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={addPhotoPreview}
                          alt="Participant Preview"
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #7c3aed',
                            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {isUploadingAddPhoto ? (
                              <>
                                <Loader2 size={14} className="animate-spin" style={{ color: '#7c3aed' }} />
                                <span>Uploading to server...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} color="#16a34a" />
                                <span style={{ color: '#16a34a' }}>Photo Attached</span>
                              </>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                            Will display in circular frame on 3" × 4" ID Badge
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: '#ede9fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7c3aed',
                            flexShrink: 0,
                          }}
                        >
                          <Upload size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                            Upload Participant Photograph
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            JPG, PNG, or WEBP (Max 5MB)
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {addPhotoPreview ? (
                        <button
                          type="button"
                          onClick={handleRemoveAddPhoto}
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '32px', fontSize: '0.75rem', borderColor: '#fecaca', color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <label
                          className="admin-btn admin-btn-secondary"
                          style={{
                            height: '32px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            fontWeight: 600,
                          }}
                        >
                          <Upload size={13} />
                          <span>Choose Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAddPhotoSelect}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {addPhotoError && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={13} />
                      <span>{addPhotoError}</span>
                    </div>
                  )}
                </div>

                {/* Section 3: Participation Type */}
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
                        <label className="admin-label">
                          Performance Type <span style={{ color: '#ef4444' }}>*</span>
                        </label>
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
                        <label className="admin-label">
                          Stage Name / Introduction <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Stage name or full name"
                          value={stageName}
                          style={formErrors.stageName ? { borderColor: '#ef4444', backgroundColor: '#fff5f5' } : {}}
                          onChange={(e) => {
                            setStageName(e.target.value);
                            if (formErrors.stageName) setFormErrors((prev) => ({ ...prev, stageName: '' }));
                          }}
                        />
                        {formErrors.stageName && (
                          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 500 }}>
                            {formErrors.stageName}
                          </div>
                        )}
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

                {/* Section 4: Event Discovery */}
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
                      <label className="admin-label">
                        Specify Source <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Word of mouth"
                        value={discoverySourceOther}
                        style={formErrors.discoverySourceOther ? { borderColor: '#ef4444', backgroundColor: '#fff5f5' } : {}}
                        onChange={(e) => {
                          setDiscoverySourceOther(e.target.value);
                          if (formErrors.discoverySourceOther) setFormErrors((prev) => ({ ...prev, discoverySourceOther: '' }));
                        }}
                      />
                      {formErrors.discoverySourceOther && (
                        <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 500 }}>
                          {formErrors.discoverySourceOther}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
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

      {/* Participant ID Card Modal */}
      <ParticipantIdCardModal
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setSelectedForCard(null);
        }}
        participant={selectedForCard}
        participantsList={
          selectedIds.length > 0 && !selectedForCard
            ? registrations.filter((r) => selectedIds.includes(r.registrationId || r.id))
            : undefined
        }
      />
    </div>
  );
};
