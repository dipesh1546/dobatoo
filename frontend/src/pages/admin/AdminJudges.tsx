import React, { useState, useEffect } from 'react';
import {
  Award,
  UserPlus,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Power,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import type { Judge, JudgeRole, JudgeStatus } from '../../types/poetryJudging';
import { judgeService } from '../../services/admin/judgeService';

export const AdminJudgesPage: React.FC = () => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<JudgeRole>('JUDGE');
  const [status, setStatus] = useState<JudgeStatus>('ACTIVE');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadJudges = async () => {
    setLoading(true);
    try {
      const res = await judgeService.getJudges();
      if (res.data) setJudges(res.data);
    } catch (err) {
      console.error('Failed loading judges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJudges();
  }, []);

  const openAddModal = () => {
    setEditingJudge(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('JUDGE');
    setStatus('ACTIVE');
    setShowModal(true);
  };

  const openEditModal = (j: Judge) => {
    setEditingJudge(j);
    setName(j.name);
    setEmail(j.email);
    setPhone(j.phone || '');
    setRole(j.role);
    setStatus(j.status);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingJudge) {
        const res = await judgeService.updateJudge(editingJudge.id, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          role,
          status,
        });
        if (res.success) {
          setNotification({ type: 'success', message: 'Judge details updated successfully ✓' });
          setShowModal(false);
          loadJudges();
        } else {
          setNotification({ type: 'error', message: res.message || 'Failed updating judge.' });
        }
      } else {
        const res = await judgeService.createJudge(
          name.trim(),
          email.trim().toLowerCase(),
          role,
          phone.trim() || undefined
        );
        if (res.success) {
          setNotification({ type: 'success', message: 'Judge added successfully ✓ An invitation link has been registered.' });
          setShowModal(false);
          loadJudges();
        } else {
          setNotification({ type: 'error', message: res.message || 'Failed creating judge account.' });
        }
      }
    } catch {
      setNotification({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await judgeService.toggleJudgeStatus(id);
      if (res.success) {
        loadJudges();
        setNotification({ type: 'success', message: 'Judge status updated ✓' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed toggling judge status.' });
    }
  };

  const handleDelete = async (id: string, judgeName: string) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove judge "${judgeName}"?`)) return;
    try {
      const res = await judgeService.deleteJudge(id);
      if (res.success) {
        loadJudges();
        setNotification({ type: 'success', message: 'Judge removed successfully ✓' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed deleting judge.' });
    }
  };

  const filteredJudges = judges.filter((j) => {
    const term = searchTerm.toLowerCase();
    return (
      j.name.toLowerCase().includes(term) ||
      j.email.toLowerCase().includes(term) ||
      (j.phone && j.phone.includes(term)) ||
      j.id.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Judges Management
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Authorized judges panel for DOBATO Open Mic & Poetry competition
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-secondary" onClick={loadJudges}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
            <UserPlus size={16} />
            <span>+ Add Judge</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          style={{
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: notification.type === 'success' ? '#15803d' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search judges by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          <div>Total Judges: <strong style={{ color: '#0f172a' }}>{judges.length}</strong></div>
          <div>Active: <strong style={{ color: '#16a34a' }}>{judges.filter((j) => j.status === 'ACTIVE').length}</strong></div>
          <div>Head Judges: <strong style={{ color: '#7c3aed' }}>{judges.filter((j) => j.role === 'HEAD_JUDGE').length}</strong></div>
        </div>
      </div>

      {/* Judges Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judge ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Assigned Entries</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading judges panel...
                  </td>
                </tr>
              ) : filteredJudges.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No judges found. Click "+ Add Judge" to register a judge.
                  </td>
                </tr>
              ) : (
                filteredJudges.map((j) => (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#7c3aed' }}>
                      {j.id}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: j.role === 'HEAD_JUDGE' ? '#f3e8ff' : '#e0f2fe',
                            color: j.role === 'HEAD_JUDGE' ? '#7c3aed' : '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {j.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{j.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={13} color="#94a3b8" />
                        <span>{j.email}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {j.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={13} color="#94a3b8" />
                          <span>{j.phone}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor: j.role === 'HEAD_JUDGE' ? '#fef3c7' : '#f1f5f9',
                          color: j.role === 'HEAD_JUDGE' ? '#92400e' : '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {j.role === 'HEAD_JUDGE' && <Award size={12} />}
                        {j.role === 'HEAD_JUDGE' ? 'Head Judge' : 'Judge'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor: j.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                          color: j.status === 'ACTIVE' ? '#15803d' : '#991b1b',
                        }}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                        {j.assignedEntryIds?.length || 0} entries
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          title={j.status === 'ACTIVE' ? 'Disable Judge' : 'Activate Judge'}
                          onClick={() => handleToggle(j.id)}
                        >
                          <Power size={13} color={j.status === 'ACTIVE' ? '#16a34a' : '#94a3b8'} />
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          title="Edit Judge"
                          onClick={() => openEditModal(j)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem', color: '#dc2626' }}
                          title="Remove Judge"
                          onClick={() => handleDelete(j.id, j.name)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
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
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingJudge ? 'Edit Judge Details' : 'Add New Judge'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {editingJudge ? `Updating ${editingJudge.id}` : 'Create an authorized judge for scoring'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Dr. Ramesh Luitel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  placeholder="judge@dobato.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="admin-input"
                  placeholder="+977 98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Role</label>
                  <select
                    className="admin-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as JudgeRole)}
                  >
                    <option value="JUDGE">Standard Judge</option>
                    <option value="HEAD_JUDGE">Head Judge</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JudgeStatus)}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                <strong>Security Notice:</strong> Judge accounts authenticate via authorized email invitation credentials. Passwords are encrypted and never exposed in the administration console.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  {submitting ? 'Saving...' : editingJudge ? 'Update Judge' : 'Create Judge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
