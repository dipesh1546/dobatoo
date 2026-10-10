import React from 'react';
import type { LogoProps } from '../../../types/components';
import './Logo.css';

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const heightMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 58,
  }[size];

  if (variant === 'compact') {
    return (
      <div
        className={`dobato-logo dobato-logo-${size} dobato-logo-compact ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <img
          src="/favicon.png"
          alt="DOBATO"
          width={heightMap}
          height={heightMap}
          className="dobato-logo-img"
          style={{
            height: `${heightMap}px`,
            width: `${heightMap}px`,
            objectFit: 'contain',
            borderRadius: size === 'sm' ? '6px' : '8px',
          }}
        />
      </div>
    );
  }

  const wordmarkClass =
    variant === 'light'
      ? 'dobato-logo-wordmark-light'
      : variant === 'dark'
      ? 'dobato-logo-wordmark-dark'
      : 'dobato-logo-wordmark-gradient';

  return (
    <div
      className={`dobato-logo dobato-logo-${size} dobato-logo-${variant} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="dobato-logo-icon-wrapper">
        <img
          src="/favicon.png"
          alt="DOBATO Logo"
          width={heightMap}
          height={heightMap}
          className="dobato-logo-img"
          style={{
            height: `${heightMap}px`,
            width: `${heightMap}px`,
            objectFit: 'contain',
            borderRadius: size === 'sm' ? '6px' : size === 'md' ? '8px' : '10px',
            display: 'block',
          }}
        />
      </div>
      <div className="dobato-logo-text-group">
        <span className={`dobato-logo-wordmark ${wordmarkClass}`}>
          Dobato<span className="dobato-logo-accent-o">o</span>
        </span>
        {showTagline && (
          <span className="dobato-logo-tagline">
            Two Paths. One Connection.
          </span>
        )}
      </div>
    </div>
  );
};

