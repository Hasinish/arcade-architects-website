import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type CurtainPhase = 'idle' | 'covering' | 'revealing';

interface PageTransitionContextType {
  navigateWithCurtain: (to: string) => void;
  curtainPhase: CurtainPhase;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateWithCurtain: () => {},
  curtainPhase: 'idle',
});

export const useCinematicNavigation = () => useContext(PageTransitionContext);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('idle');
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const navigateWithCurtain = useCallback(
    (to: string) => {
      // If already at target path, simply scroll to top
      if (location.pathname === to) {
        const lenis = (window as any).lenis;
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // If user prefers reduced motion, bypass curtain wipe
      if (prefersReducedMotion) {
        const lenis = (window as any).lenis;
        if (lenis) lenis.stop();
        window.scrollTo(0, 0);
        navigate(to);
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
          lenis.start();
        }
        return;
      }

      // Trigger architectural curtain reveal
      setTargetPath(to);
      setCurtainPhase('covering');

      // Pause Lenis smooth scroll while curtain is covering
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.stop();
      }
    },
    [location.pathname, navigate, prefersReducedMotion]
  );

  // Handle phase transitions
  const handleCoverComplete = useCallback(() => {
    if (curtainPhase === 'covering' && targetPath) {
      // 1. Reset scroll position immediately while fully covered
      window.scrollTo(0, 0);
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }

      // 2. Perform React Router navigation
      navigate(targetPath);

      // 3. Small RAF tick to ensure target page DOM has mounted at scrollY=0
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (lenis) lenis.scrollTo(0, { immediate: true });
        setCurtainPhase('revealing');
      });
    }
  }, [curtainPhase, targetPath, navigate]);

  const handleRevealComplete = useCallback(() => {
    if (curtainPhase === 'revealing') {
      setCurtainPhase('idle');
      setTargetPath(null);

      // Resume Lenis smooth scroll
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
      }
    }
  }, [curtainPhase]);

  // Fallback watchdog timer so curtainPhase can never stay stuck if onAnimationComplete is dropped
  useEffect(() => {
    if (curtainPhase === 'covering') {
      const watchdog = setTimeout(() => {
        handleCoverComplete();
      }, 900);
      return () => clearTimeout(watchdog);
    } else if (curtainPhase === 'revealing') {
      const watchdog = setTimeout(() => {
        handleRevealComplete();
      }, 900);
      return () => clearTimeout(watchdog);
    }
  }, [curtainPhase, handleCoverComplete, handleRevealComplete]);

  return (
    <PageTransitionContext.Provider value={{ navigateWithCurtain, curtainPhase }}>
      {children}

      {/* Full-Screen Architectural Curtain Reveal Overlay (#F7F7F7) */}
      <AnimatePresence>
        {curtainPhase !== 'idle' && (
          <motion.div
            key="architectural-curtain"
            initial={{ y: '100%' }}
            animate={
              curtainPhase === 'covering'
                ? { y: '0%' }
                : { y: '-100%' }
            }
            transition={{
              duration: curtainPhase === 'covering' ? 0.52 : 0.58,
              ease: [0.76, 0, 0.24, 1], // Architectural cubic-bezier curve
            }}
            onAnimationComplete={() => {
              if (curtainPhase === 'covering') {
                handleCoverComplete();
              } else if (curtainPhase === 'revealing') {
                handleRevealComplete();
              }
            }}
            className={`fixed inset-0 z-[9999] bg-[#F7F7F7] flex flex-col items-center justify-center border-t border-[#2E2E2E]/10 ${
              curtainPhase === 'covering' ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{ willChange: 'transform' }}
          >
            {/* Minimal Subtle Studio Monogram in Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 text-[#2E2E2E]/80"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <img
                  src="/assets/Logo/Logo.png"
                  alt="Arcade Architects"
                  className="w-full h-full object-contain filter brightness-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png';
                  }}
                />
              </div>
              <span className="font-sans text-xs uppercase tracking-[3px] font-medium text-[#2E2E2E]/70">
                ARCADE ARCHITECTS
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
};

