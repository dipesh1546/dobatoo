import React from 'react';
import type { CardProps } from '../../../types/components';
import './Card.css';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = true,
  glow = false,
  className = '',
  ...props
}) => {
  const classes = [
    'dobato-card',
    `dobato-card-${variant}`,
    hoverEffect ? 'dobato-card-hover' : '',
    glow ? 'dobato-card-glow' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
