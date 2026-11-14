import React, { useEffect, useRef } from 'react';

/**
 * Custom viewport-right scrollbar thumb with a 100% transparent track
 * and real `mix-blend-mode: difference` negative white compositing.
 */
export const NegativeScrollbar: React.FC = () => {
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    let rafId = 0;
    const TRACK_PADDING = 6;
    const MIN_THUMB_HEIGHT = 36;

    const updateThumb = () => {
      rafId = 0;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      const isScrollLocked = document.documentElement.style.overflow === 'hidden';

      if (maxScroll <= 2 || isScrollLocked) {
        thumb.style.opacity = '0';
        return;
      }

      const usableHeight = Math.max(MIN_THUMB_HEIGHT, winHeight - TRACK_PADDING * 2);
      const thumbHeight = Math.max(
        MIN_THUMB_HEIGHT,
        Math.round((winHeight / docHeight) * usableHeight)
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const y = TRACK_PADDING + progress * (usableHeight - thumbHeight);

      thumb.style.opacity = '1';
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateThumb);
      }
    };

    updateThumb();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);

    const styleObserver = new MutationObserver(scheduleUpdate);
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver.disconnect();
      styleObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={thumbRef}
      aria-hidden="true"
      data-negative-scrollbar
      className="fixed top-0 right-1.5 z-[955] w-[4px] rounded-full bg-white hero-negative pointer-events-none transition-opacity duration-200"
      style={{ opacity: 0, height: '48px', willChange: 'transform, height, opacity' }}
    />
  );
};
