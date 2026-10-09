import React from 'react';
import type { SectionProps } from '../../../types/components';
import './Section.css';

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'dark',
  padding = 'lg',
  className = '',
  id,
  ...props
}) => {
  return (
    <section
      id={id}
      className={`dobato-section dobato-section-${variant} dobato-section-pad-${padding} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};
