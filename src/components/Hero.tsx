import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useIntro } from '../context/IntroContext';
import { EASE, gsap, setupGsap, SplitText, useGSAP } from '../lib/gsap';

interface HeroProps {
  onOpenInquiry: () => void;
}

const SPLIT_VARS = { type: 'lines', mask: 'lines', linesClass: 'line' } as const;

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const root = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLDivElement>(null);
  const { register, status, shouldRunIntro, registerHeroStage } = useIntro();
  const isIntroActive = shouldRunIntro && status !== 'done';

  // Register hero media stage before paint so Preloader can animate it directly
  useLayoutEffect(() => {
    registerHeroStage({
      mediaWrap: mediaRef.current,
      video: videoRef.current,
      scrim: scrimRef.current,
      introLogo: introLogoRef.current,
    });
    return () => registerHeroStage(null);
  }, [registerHeroStage]);

  // Keep single <video> paused at frame 0 before expansion, and ensure playback once intro completes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldRunIntro && status === 'pending') {
      video.pause();
      if (video.currentTime !== 0) {
        try {
          video.currentTime = 0;
        } catch {
          // ignore if metadata not yet loaded
        }
      }
      return;
    }

    if (status === 'done') {
      gsap.set([mediaRef.current, video, scrimRef.current].filter(Boolean), {
        clearProps: 'clipPath,transform,opacity,visibility',
      });
      if (video.paused) {
        video.play().catch(() => {
          // autoplay fallback handled by muted+playsInline
        });
      }
    }
  }, [shouldRunIntro, status]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const content = el.querySelector<HTMLElement>('[data-hero-content]');
      const heading = el.querySelector<HTMLElement>('[data-hero-title]');
      const sub = el.querySelector<HTMLElement>('[data-hero-sub]');
      const actions = el.querySelector<HTMLElement>('[data-hero-actions]');
      if (!content || !heading || !sub || !actions) return;

      if (!shouldRunIntro || status === 'done') {
        gsap.set(
          [mediaRef.current, videoRef.current, scrimRef.current, content, actions].filter(Boolean),
          { clearProps: 'all' },
        );
        return;
      }

      setupGsap();
      const ctx = gsap.context(() => {}, el);
      gsap.set(content, { autoAlpha: 0 });
      if (mediaRef.current) {
        gsap.set(mediaRef.current, { clipPath: 'inset(50% 50% 50% 50%)' });
      }
      if (scrimRef.current) {
        gsap.set(scrimRef.current, { autoAlpha: 0 });
      }

      let splits: SplitText[] = [];
      let revealed = false;

      const padMasks = () =>
        gsap.set(
          splits.flatMap((s) => s.masks),
          { paddingBottom: '0.16em', marginBottom: '-0.16em' },
        );

      const split = () => {
        splits.forEach((s) => s.revert());
        splits = [heading, sub].map((target) => SplitText.create(target, SPLIT_VARS));
        padMasks();
      };

      const unregister = register((tl, { reveal }) => {
        ctx.add(() => {
          split();
          const [h, s] = splits;
          gsap.set(content, { autoAlpha: 1 });
          gsap.set(
            splits.flatMap((x) => x.lines),
            { yPercent: 120 },
          );
          gsap.set(actions, { y: 22, autoAlpha: 0 });

          tl.to(
            h.lines,
            { yPercent: 0, duration: 1.5, ease: EASE.settle, stagger: 0.12 },
            reveal,
          );
          tl.to(
            s.lines,
            { yPercent: 0, duration: 1.3, ease: EASE.settle, stagger: 0.08 },
            `${reveal}+=0.35`,
          );
          tl.to(
            actions,
            {
              y: 0,
              autoAlpha: 1,
              duration: 1.1,
              ease: EASE.settle,
              clearProps: 'transform,opacity,visibility',
            },
            `${reveal}+=0.45`,
          );
          tl.call(
            () => {
              revealed = true;
            },
            [],
            `${reveal}+=2`,
          );
        });
      });

      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (!revealed || window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        split();
      };
      window.addEventListener('resize', onResize);

      return () => {
        unregister();
        window.removeEventListener('resize', onResize);
        splits.forEach((s) => s.revert());
        ctx.revert();
      };
    },
    { scope: root, dependencies: [register, shouldRunIntro] },
  );

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className={
        isIntroActive
          ? 'relative w-full h-[200vh] -mb-[100vh]'
          : 'relative w-full h-[200vh] -mb-[100vh] z-10'
      }
    >
      {/* Fullscreen 100vh Viewport (non-sticky during intro so content layers cleanly above Preloader) */}
      <div
        className={
          isIntroActive
            ? 'relative w-full h-screen overflow-hidden bg-[#121212]'
            : 'sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#121212]'
        }
      >
        {/* Edge-to-Edge Background Architectural Visual / Showreel (Single <video> revealed & expanded by Preloader) */}
        <div
          ref={mediaRef}
          data-hero-media
          className={
            isIntroActive
              ? 'fixed inset-0 z-[942] overflow-hidden bg-[#121212]'
              : 'absolute inset-0 overflow-hidden bg-[#121212]'
          }
        >
          <video
            ref={videoRef}
            autoPlay={!shouldRunIntro}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>

          {/* Transparent Scrim Anchor (preserves 100% raw video luminance for true difference inversion) */}
          <div
            ref={scrimRef}
            data-hero-scrim
            className="absolute inset-0 bg-transparent pointer-events-none"
          />

          {/* Centered Negative-Blended Arcade Arch Mark inside the initial center frame */}
          {isIntroActive && (
            <div
              ref={introLogoRef}
              data-hero-intro-logo
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-white mix-blend-difference"
            >
              <svg
                viewBox="0 0 100 112"
                fill="currentColor"
                aria-label="Arcade Architects"
                style={{
                  height: 'var(--intro-logo-size, min(17vh, 17vw))',
                  width: 'auto',
                }}
              >
                <path d="M0 112V50a50 50 0 0 1 100 0v62H75V50a25 25 0 0 0-50 0v62H0Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Hero Editorial Typography Stage (NO z-index here so children blend directly against <video>) */}
        <div
          data-hero-content
          style={shouldRunIntro && status === 'pending' ? { visibility: 'hidden' } : undefined}
          className="absolute inset-0 pointer-events-none flex flex-col justify-end"
        >
          <div className="w-full px-5 sm:px-8 md:px-10 pb-8 sm:pb-10 md:pb-12 flex flex-col items-center text-center">
            {/* Centered Studio Descriptor (solid white) */}
            <div
              data-hero-sub
              className={`relative text-[10px] sm:text-xs font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase text-white mb-4 md:mb-5 ${
                isIntroActive ? 'z-[945]' : 'z-10'
              }`}
            >
              Architectural Planning / Interior Design / Exterior Design
            </div>

            {/* Monumental Middle-Bottom Headline (Difference-blended directly against moving video) */}
            <h1
              data-hero-title
              className={`relative w-full font-sans text-[clamp(2.25rem,5.5vw,6.25rem)] font-normal leading-[0.96] tracking-[-0.03em] text-center hero-negative ${
                isIntroActive ? 'z-[945]' : 'z-10'
              }`}
            >
              At Arcade,
              <br />
              imagination becomes architecture.
            </h1>

            {/* Centered Minimal Editorial CTAs (pure white) */}
            <div
              data-hero-actions
              className={`relative pointer-events-auto flex items-center justify-center gap-6 sm:gap-9 mt-6 md:mt-7 text-white ${
                isIntroActive ? 'z-[945]' : 'z-10'
              }`}
            >
              {[
                { label: 'Explore Projects', href: '#portfolio', primary: false },
                { label: 'Start a Project', onClick: onOpenInquiry, primary: true },
              ].map((cta) => {
                const inner = (
                  <>
                    <span className="hero-cta-track">
                      <span className="hero-cta-roller">
                        <span>{cta.label}</span>
                        <span aria-hidden="true">{cta.label}</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="hero-cta-arrow">
                      <span>↗</span>
                      <span>↗</span>
                    </span>
                  </>
                );
                const cls = `hero-cta ${
                  cta.primary ? 'hero-cta-primary font-medium' : 'font-normal'
                } text-[11px] sm:text-xs tracking-[0.14em] uppercase`;

                return cta.href ? (
                  <a key={cta.label} href={cta.href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button key={cta.label} type="button" onClick={cta.onClick} className={`${cls} cursor-pointer`}>
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
