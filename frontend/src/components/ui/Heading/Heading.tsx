import React from 'react';
import type { HeadingProps } from '../../../types/components';
import './Heading.css';

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  fontFamily = 'sans',
  gradient = false,
  gradientVariant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = {
    h1: 'text-h1',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-body-lg',
    h6: 'text-body',
  }[Component];

  const fontClass = fontFamily === 'serif' ? 'dobato-heading-serif' : 'dobato-heading-sans';
  const gradientClass = gradient ? `dobato-heading-gradient-${gradientVariant}` : '';

  return (
    <Component
      className={`dobato-heading ${sizeClass} ${fontClass} ${gradientClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
