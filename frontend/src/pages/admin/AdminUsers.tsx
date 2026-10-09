import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Power,
  Trash2,
  Mail,
  Shield,
  X,
  Clock,
} from 'lucide-react';
import { adminUsersService, type AdminUserData } from '../../services/admin/adminUsersService';
import { adminAuthService } from '../../services/admin/adminAuthService';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ORGANIZER' | 'VOLUNTEER'>('ORGANIZER');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentUser = adminAuthService.getUser();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminUsersService.getAdminUsers();
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error('Failed loading admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setNotification(null);

    try {
      const res = await adminUsersService.createAdminUser(
        name.trim(),
        email.trim().toLowerCase(),
        role
      );
      if (res.success) {
        setNotification({ type: 'success', message: 'Admin user added successfully ✓' });
        setName('');
        setEmail('');
        setShowModal(false);
        loadUsers();
      } else {
        setNotification({ type: 'error', message: res.message || 'Failed creating admin user.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Error adding admin user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await adminUsersService.toggleUserStatus(id);
      if (res.success) {
        loadUsers();
        setNotification({ type: 'success', message: 'User status updated ✓' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed updating user status.' });
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete administrator "${userName}"?`)) return;
    try {
      const res = await adminUsersService.deleteUser(id);
      if (res.success) {
        loadUsers();
        setNotification({ type: 'success', message: 'Admin user removed ✓' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed deleting admin user.' });
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Admin Users
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Authorized portal administrators and role-based access management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-secondary" onClick={loadUsers}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} />
            <span>+ Add Admin User</span>
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

      {/* Search and Summary */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search admins by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          <div>Total Admins: <strong style={{ color: '#0f172a' }}>{users.length}</strong></div>
          <div>Active: <strong style={{ color: '#16a34a' }}>{users.filter((u) => u.status === 'ACTIVE').length}</strong></div>
          <div>Super Admins: <strong style={{ color: '#7c3aed' }}>{users.filter((u) => u.role === 'SUPER_ADMIN').length}</strong></div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading admin users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#7c3aed' }}>
                      {u.id}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#f3e8ff',
                            color: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                        {currentUser?.email === u.email && (
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#e2e8f0', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#475569' }}>
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={13} color="#94a3b8" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor:
                            u.role === 'SUPER_ADMIN' ? '#fef3c7' : u.role === 'ORGANIZER' ? '#e0f2fe' : '#f1f5f9',
                          color:
                            u.role === 'SUPER_ADMIN' ? '#92400e' : u.role === 'ORGANIZER' ? '#0369a1' : '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Shield size={12} />
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor: u.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                          color: u.status === 'ACTIVE' ? '#15803d' : '#991b1b',
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      {u.lastLogin ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} />
                          <span>{new Date(u.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          title={u.status === 'ACTIVE' ? 'Disable Account' : 'Activate Account'}
                          onClick={() => handleToggle(u.id)}
                        >
                          <Power size={13} color={u.status === 'ACTIVE' ? '#16a34a' : '#94a3b8'} />
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem', color: '#dc2626' }}
                          title="Delete Admin"
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={currentUser?.email === u.email}
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

      {/* Add Modal */}
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
              maxWidth: '500px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add Admin User
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Grant administrative access to DOBATO organizer portal
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Subash Shrestha"
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
                  placeholder="organizer@dobato.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Role</label>
                <select
                  className="admin-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="ORGANIZER">Organizer (Manage participants & event)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full system control)</option>
                  <option value="VOLUNTEER">Volunteer (View only access)</option>
                </select>
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
                <strong>Security:</strong> The new user will receive authorization credentials to authenticate at <code>/admin/login</code>. Passwords are never revealed in plain text.
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
                  {submitting ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
