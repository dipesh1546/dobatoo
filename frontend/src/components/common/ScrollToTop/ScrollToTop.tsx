import React from 'react';
import { useScrollToTop } from '../../../hooks/useScrollToTop';

/**
 * ScrollToTop component.
 * Place inside <BrowserRouter> to auto-scroll on route changes.
 * - Page navigation → scroll to top (instant)
 * - Hash navigation → scroll to section (smooth)
 */
export const ScrollToTop: React.FC = () => {
  useScrollToTop();
  return null;
};
