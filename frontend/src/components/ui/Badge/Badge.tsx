import React from 'react';
import type { BadgeProps } from '../../../types/components';
import './Badge.css';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`dobato-badge dobato-badge-${variant} dobato-badge-${size} ${className}`}
      {...props}
    >
      {icon && <span className="dobato-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
