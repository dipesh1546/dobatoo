import React from 'react';
import type { LoadingSpinnerProps } from '../../../types/components';
import { Heart } from 'lucide-react';
import './LoadingSpinner.css';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  const heartSize = {
    sm: 12,
    md: 20,
    lg: 28,
  }[size];

  return (
    <div
      className={`dobato-spinner-container dobato-spinner-${size} ${className}`}
      role="status"
      aria-label={label}
    >
      <div className="dobato-spinner-ring">
        <div className="dobato-spinner-inner">
          <Heart size={heartSize} fill="url(#dobato-path-1)" className="dobato-spinner-heart" />
        </div>
      </div>
      {label && <span className="dobato-spinner-label">{label}</span>}
    </div>
  );
};
