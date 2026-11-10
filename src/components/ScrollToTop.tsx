import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to a specific anchor/hash, don't clobber scroll to 0
    const hasScrollTarget = Boolean(sessionStorage.getItem('arcade_scroll_target') || hash);
    if (hasScrollTarget) {
      return;
    }

    // Reset scroll immediately via Lenis if active, fallback to native window
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

