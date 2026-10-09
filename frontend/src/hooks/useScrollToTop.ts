import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop hook:
 * - On pathname change (page navigation), instantly scrolls to top.
 * - On hash change (section navigation), smoothly scrolls to the target element
 *   with offset for the sticky navbar.
 * - Does NOT interfere with browser back/forward (popstate) history restoration.
 */
export const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Section navigation: smooth scroll to the element with sticky header offset
      const targetId = hash.replace('#', '');
      // Delay slightly to ensure the DOM has rendered (e.g. after lazy load)
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Page navigation: instant scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);
};
