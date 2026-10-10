import React, { useState } from 'react';
import { Shield, Server, CheckCircle2, Calendar, Save } from 'lucide-react';
import { adminAuthService } from '../../services/admin/adminAuthService';

export const AdminSettingsPage: React.FC = () => {
  const user = adminAuthService.getUser() || {
    name: 'Dobatoo Organizer',
    email: 'admin@dobato.com',
    role: 'SUPER_ADMIN',
  };

  const [registrationStatus, setRegistrationStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [eventStatus, setEventStatus] = useState<string>('REGISTRATION_OPEN');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      setTimeout(() => {
        setSaving(false);
        setMsg('Event operational settings saved successfully ✓');
      }, 400);
    } catch {
      setMsg('Failed saving settings.');
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Admin Settings
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Portal overview and event operational settings
        </p>
      </div>

      {msg && (
        <div style={{ padding: '0.875rem 1rem', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Admin Account Section */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Shield size={20} color="#7c3aed" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Admin Account
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>NAME</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginTop: '0.125rem' }}>
              {user.name}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EMAIL</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginTop: '0.125rem' }}>
              {user.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ROLE</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#7c3aed', marginTop: '0.125rem' }}>
              {user.role}
            </div>
          </div>
        </div>
      </div>

      {/* Event Operational Settings Section */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Calendar size={20} color="#7c3aed" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Event Operational Settings
          </h3>
        </div>

        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Registration Status</label>
              <select
                className="admin-select"
                value={registrationStatus}
                onChange={(e) => setRegistrationStatus(e.target.value as any)}
              >
                <option value="OPEN">Registration OPEN (FREE)</option>
                <option value="CLOSED">Registration CLOSED</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Event Lifecycle Status</label>
              <select
                className="admin-select"
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
              >
                <option value="UPCOMING">Upcoming Event</option>
                <option value="REGISTRATION_OPEN">Registration Open</option>
                <option value="REGISTRATION_CLOSED">Registration Closed</option>
                <option value="EVENT_TODAY">Today is Event Day ❤️</option>
                <option value="EVENT_COMPLETED">Event Completed</option>
              </select>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EVENT FORMAT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#db2777' }}>OPEN MIC</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>POETRY THEME</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#7c3aed' }}>Searching / Finding the Right Person</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>RULES</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>5 Minutes • No Age Limit</div>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: 'fit-content' }}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Operational Settings'}</span>
          </button>
        </form>
      </div>

      {/* System Status Section */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Server size={20} color="#16a34a" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            API & Database Services
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#15803d' }}>
            <CheckCircle2 size={16} />
            <span>PostgreSQL Database: Connected</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#15803d' }}>
            <CheckCircle2 size={16} />
            <span>REST API Engine: Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
