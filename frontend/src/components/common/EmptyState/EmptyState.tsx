import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There are no items to display at this moment.',
  icon = <Inbox size={36} color="#94A3B8" />,
  action,
  style = {},
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        margin: '1rem 0',
        ...style,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {icon}
      </div>

      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--dobato-white, #0f172a)', margin: '0 0 0.35rem 0' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '380px', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
        {description}
      </p>

      {action}
    </div>
  );
};
