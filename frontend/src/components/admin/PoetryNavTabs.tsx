import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Sliders,
  CheckSquare,
  BarChart3,
  Trophy,
} from 'lucide-react';

export const PoetryNavTabs: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { label: 'Dashboard', path: '/admin/poetry', icon: LayoutDashboard, exact: true },
    { label: 'Judges', path: '/admin/judges', icon: Users },
    { label: 'Criteria', path: '/admin/poetry/criteria', icon: Sliders },
    { label: 'Scoring', path: '/admin/poetry/scoring', icon: CheckSquare },
    { label: 'Results', path: '/admin/poetry/results', icon: BarChart3 },
    { label: 'Winners', path: '/admin/poetry/winners', icon: Trophy },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
        overflowX: 'auto',
        marginBottom: '1rem',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact
          ? location.pathname === tab.path
          : location.pathname.startsWith(tab.path);

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              backgroundColor: isActive ? '#f3e8ff' : 'transparent',
              color: isActive ? '#7c3aed' : '#64748b',
              border: isActive ? '1px solid #d8b4fe' : '1px solid transparent',
            }}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
