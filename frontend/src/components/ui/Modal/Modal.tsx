import React, { useEffect } from 'react';
import type { ModalProps } from '../../../types/components';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dobato-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dobato-modal-title' : undefined}
    >
      <div
        className={`dobato-modal-content dobato-modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dobato-modal-header">
          {title ? (
            <h3 id="dobato-modal-title" className="dobato-modal-title">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            className="dobato-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="dobato-modal-body">{children}</div>
      </div>
    </div>
  );
};
