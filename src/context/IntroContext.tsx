import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, setupGsap } from '../lib/gsap';

export type IntroLabels = { reveal: string };
export type IntroBuilder = (tl: gsap.core.Timeline, labels: IntroLabels) => void;
export type IntroStatus = 'pending' | 'running' | 'done';

export interface HeroStageElements {
  mediaWrap: HTMLElement | null;
  video: HTMLVideoElement | null;
  scrim: HTMLElement | null;
  introLogo?: HTMLElement | null;
}

function hasReplayParam(search: string): boolean {
  const params = new URLSearchParams(search);
  const intro = params.get('intro') ?? params.get('replay') ?? params.get('preloader');
  return intro === '1' || intro === 'true';
}

function prefersReducedMotionNow(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function computeShouldRunIntro(pathname: string): boolean {
  if (typeof window === 'undefined') return false;
  if (pathname !== '/') return false;
  if (prefersReducedMotionNow()) return false;
  try {
    if (sessionStorage.getItem('arcade_scroll_target')) return false;
  } catch {
    // ignore storage restrictions
  }
  return true;
}

interface IntroApi {
  status: IntroStatus;
  shouldRunIntro: boolean;
  /** Add Hero/Navbar tweens to the master timeline at the `reveal` label. */
  register: (builder: IntroBuilder) => () => void;
  /** Claim intro orchestration so fallback auto-reveal doesn't fire prematurely. */
  claim: () => void;
  /** Build and play the master timeline once assets/fonts are ready. */
  conduct: (setup: (tl: gsap.core.Timeline) => void) => gsap.core.Timeline;
  /** Register the homepage hero media stage (wrapper, single <video>, scrim) so the preloader can reveal and expand it directly. */
  registerHeroStage: (stage: HeroStageElements | null) => void;
  /** Read the currently registered hero stage elements. */
  getHeroStage: () => HeroStageElements | null;
  /** Wait for the hero <video> to buffer playable frames (canplay), capped at `ms`. */
  waitForHeroVideoFrame: (ms: number) => Promise<void>;
  /** Start playing the single hero <video> during the final preloader expansion transition. */
  startHeroVideo: () => void;
}

const IntroContext = createContext<IntroApi | null>(null);

function unlockScrollSafely() {
  document.documentElement.style.overflow = '';
  const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
  const menuOpen = Boolean(document.querySelector('[data-navbar-menu]'));
  if (lenis && !menuOpen) {
    lenis.start();
  }
}

export const IntroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [shouldRunIntro, setShouldRunIntro] = useState<boolean>(() =>
    computeShouldRunIntro(
      typeof window !== 'undefined' ? window.location.pathname : '/',
    ),
  );
  const [status, setStatus] = useState<IntroStatus>(() => (shouldRunIntro ? 'pending' : 'done'));

  const builders = useRef(new Set<IntroBuilder>());
  const claimed = useRef(false);
  const started = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const heroStageRef = useRef<HeroStageElements | null>(null);
  const statusRef = useRef(status);
  const shouldRunIntroRef = useRef(shouldRunIntro);
  useEffect(() => {
    statusRef.current = status;
    shouldRunIntroRef.current = shouldRunIntro;
  }, [status, shouldRunIntro]);
  const lastReplayKey = useRef<string | null>(
    hasReplayParam(typeof window !== 'undefined' ? window.location.search : '')
      ? `${location.key}-${location.search}`
      : null,
  );

  // Support explicit ?intro=1 replay links or leaving `/` mid-intro
  useEffect(() => {
    const isHome = location.pathname === '/';
    const replay = hasReplayParam(location.search);
    const replayKey = `${location.key}-${location.search}`;

    if (!isHome && status !== 'done') {
      tlRef.current?.kill();
      tlRef.current = null;
      started.current = false;
      claimed.current = false;
      unlockScrollSafely();
      setShouldRunIntro(false);
      setStatus('done');
      return;
    }

    if (isHome && replay && !prefersReducedMotionNow() && lastReplayKey.current !== replayKey) {
      lastReplayKey.current = replayKey;
      tlRef.current?.kill();
      tlRef.current = null;
      started.current = false;
      claimed.current = false;
      setShouldRunIntro(true);
      setStatus('pending');
    }
  }, [location.pathname, location.search, location.key, status]);

  // Safety net: never leave the visitor trapped behind a stuck preloader
  useEffect(() => {
    if (!shouldRunIntro || status === 'done') return;
    const lenis = (window as unknown as { lenis?: { stop: () => void } }).lenis;
    lenis?.stop();

    const safety = setTimeout(() => {
      if (tlRef.current && tlRef.current.progress() < 1) {
        tlRef.current.progress(1);
      } else {
        unlockScrollSafely();
        setStatus('done');
      }
    }, 9500);

    return () => clearTimeout(safety);
  }, [shouldRunIntro, status]);

  const register = useCallback((builder: IntroBuilder) => {
    if (!shouldRunIntroRef.current || statusRef.current === 'done') {
      return () => {};
    }
    if (started.current) {
      const tl = gsap.timeline();
      builder(tl, { reveal: 'reveal' });
      tl.progress(1);
      return () => tl.kill();
    }
    builders.current.add(builder);
    return () => {
      builders.current.delete(builder);
    };
  }, []);

  const claim = useCallback(() => {
    claimed.current = true;
  }, []);

  const conduct = useCallback((setup: (tl: gsap.core.Timeline) => void) => {
    setupGsap();
    tlRef.current?.kill();
    started.current = true;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setStatus('done');
        unlockScrollSafely();
      },
    });

    tlRef.current = tl;
    setup(tl);
    if (tl.labels.reveal === undefined) tl.addLabel('reveal', 0);
    builders.current.forEach((b) => b(tl, { reveal: 'reveal' }));
    setStatus('running');

    if (prefersReducedMotionNow()) {
      tl.progress(1);
    } else {
      tl.play();
    }
    return tl;
  }, []);

  const registerHeroStage = useCallback((stage: HeroStageElements | null) => {
    heroStageRef.current = stage;
  }, []);

  const getHeroStage = useCallback(() => heroStageRef.current, []);

  const waitForHeroVideoFrame = useCallback((ms: number) => {
    const video = heroStageRef.current?.video;
    if (!video || video.readyState >= 3) return Promise.resolve();

    return new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        video.removeEventListener('canplay', done);
        video.removeEventListener('canplaythrough', done);
        video.removeEventListener('error', done);
        resolve();
      };
      const timer = setTimeout(done, ms);
      video.addEventListener('canplay', done, { once: true });
      video.addEventListener('canplaythrough', done, { once: true });
      video.addEventListener('error', done, { once: true });
    });
  }, []);

  const startHeroVideo = useCallback(() => {
    const video = heroStageRef.current?.video;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const api = useMemo<IntroApi>(
    () => ({
      status,
      shouldRunIntro,
      register,
      claim,
      conduct,
      registerHeroStage,
      getHeroStage,
      waitForHeroVideoFrame,
      startHeroVideo,
    }),
    [status, shouldRunIntro, register, claim, conduct, registerHeroStage, getHeroStage, waitForHeroVideoFrame, startHeroVideo],
  );

  return <IntroContext.Provider value={api}>{children}</IntroContext.Provider>;
};

export function useIntro(): IntroApi {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error('useIntro must be used within IntroProvider');
  }
  return ctx;
}
