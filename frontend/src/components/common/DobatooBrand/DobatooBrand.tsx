import React from 'react';
import './DobatooBrand.css';

export interface DobatooBrandProps {
  variant?: 'gradient' | 'neon' | 'light' | 'dark' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';
  uppercase?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Dobatoo Signature Brand Typography Component
 * Renders the officially styled Dobatoo brand name with accented double "oo" / "OO",
 * neon pink-violet radiant gradient, and signature glow styling.
 */
export const DobatooBrand: React.FC<DobatooBrandProps> = ({
  variant = 'gradient',
  size = 'inherit',
  uppercase = false,
  className = '',
  style = {},
  onClick,
}) => {
  const baseClasses = [
    'dobatoo-brand-name',
    `dobatoo-brand-${variant}`,
    size !== 'inherit' ? `dobatoo-brand-size-${size}` : '',
    uppercase ? 'dobatoo-brand-uppercase' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (uppercase) {
    return (
      <span className={baseClasses} style={style} onClick={onClick}>
        DOBATO<span className="dobatoo-brand-accent-oo">O</span>
      </span>
    );
  }

  return (
    <span className={baseClasses} style={style} onClick={onClick}>
      Dobato<span className="dobatoo-brand-accent-oo">o</span>
    </span>
  );
};
