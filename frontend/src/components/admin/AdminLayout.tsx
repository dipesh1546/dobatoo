import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Feather,
  Award,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { adminAuthService } from '../../services/admin/adminAuthService';
import '../../styles/admin.css';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  const user = adminAuthService.getUser() || {
    name: 'Admin Organizer',
    email: 'admin@dobato.com',
    role: 'SUPER_ADMIN',
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Registrations', path: '/admin/registrations', icon: Users },
    { label: 'Poetry', path: '/admin/poetry', icon: Feather },
    { label: 'Judges', path: '/admin/judges', icon: Award },
    { label: 'Admin Users', path: '/admin/users', icon: ShieldCheck },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const current = location.pathname;
    if (current === '/admin') return 'Dashboard Overview';
    if (current.startsWith('/admin/registrations/')) return 'Registration Details';
    if (current === '/admin/registrations') return 'Participant Registrations';
    if (current.startsWith('/admin/poetry')) return 'Poetry & Open Mic';
    if (current.startsWith('/admin/judges')) return 'Judges Management';
    if (current.startsWith('/admin/users')) return 'Admin Users';
    if (current === '/admin/settings') return 'Admin Settings';
    return 'Admin Portal';
  };

  const handleLogout = () => {
    adminAuthService.logout();
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 95,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <img
            src="/favicon.png"
            alt="Dobatoo"
            style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'contain' }}
          />
          <div>
            <div className="admin-sidebar-brand-title">
              DOBATO<span className="dobatoo-accent-o">O</span> Admin
            </div>
            <div className="admin-sidebar-brand-sub">Grand Launch 2026</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user.name}</div>
              <div className="admin-user-role">{user.role || 'ORGANIZER'}</div>
            </div>
          </div>

          <button className="admin-btn-logout" onClick={handleLogout} title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="admin-topbar-title">{getPageTitle()}</h1>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status-chip">
              <span className="admin-status-dot" />
              <span>Backend Connected</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
