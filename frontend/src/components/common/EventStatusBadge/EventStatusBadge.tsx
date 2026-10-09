import React from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export type EventLifecycleState =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'EVENT_TODAY'
  | 'EVENT_COMPLETED';

interface EventStatusBadgeProps {
  state?: EventLifecycleState;
  className?: string;
  style?: React.CSSProperties;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({
  state = 'REGISTRATION_OPEN',
  className = '',
  style = {},
}) => {
  const getBadgeDetails = () => {
    switch (state) {
      case 'UPCOMING':
        return {
          label: 'UPCOMING EVENT',
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#60A5FA',
          border: 'rgba(59, 130, 246, 0.3)',
          icon: Calendar,
        };
      case 'REGISTRATION_OPEN':
        return {
          label: 'REGISTRATION OPEN (FREE)',
          bg: 'rgba(34, 197, 94, 0.15)',
          color: '#4ADE80',
          border: 'rgba(34, 197, 94, 0.3)',
          icon: CheckCircle2,
        };
      case 'REGISTRATION_CLOSED':
        return {
          label: 'REGISTRATION CLOSED',
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#F87171',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: Clock,
        };
      case 'EVENT_TODAY':
        return {
          label: 'TODAY IS THE LAUNCH DAY ❤️',
          bg: 'rgba(244, 114, 182, 0.25)',
          color: '#F472B6',
          border: 'rgba(244, 114, 182, 0.5)',
          icon: Sparkles,
        };
      case 'EVENT_COMPLETED':
        return {
          label: 'EVENT COMPLETED',
          bg: 'rgba(148, 163, 184, 0.15)',
          color: '#94A3B8',
          border: 'rgba(148, 163, 184, 0.3)',
          icon: Calendar,
        };
    }
  };

  const details = getBadgeDetails();
  const Icon = details.icon;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        backgroundColor: details.bg,
        color: details.color,
        border: `1px solid ${details.border}`,
        ...style,
      }}
    >
      <Icon size={14} />
      <span>{details.label}</span>
    </div>
  );
};
