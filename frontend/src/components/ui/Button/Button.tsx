import React from 'react';
import type { ButtonProps } from '../../../types/components';
import './Button.css';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const classes = [
    'dobato-btn',
    `dobato-btn-${variant}`,
    `dobato-btn-${size}`,
    fullWidth ? 'dobato-btn-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="dobato-btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="dobato-btn-icon">{icon}</span>}
          <span className="dobato-btn-label">{children}</span>
          {icon && iconPosition === 'right' && <span className="dobato-btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
};
