import React from 'react';
import type { GradientTextProps } from '../../../types/components';
import './GradientText.css';

export const GradientText: React.FC<GradientTextProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`dobato-gradient-text dobato-gradient-text-${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
