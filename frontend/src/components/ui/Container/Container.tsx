import React from 'react';
import type { ContainerProps } from '../../../types/components';
import './Container.css';

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`dobato-container dobato-container-${size} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
