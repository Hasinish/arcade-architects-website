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
  const { register, status, shouldRunIntro, registerHeroStage } = useIntro();
  const isIntroActive = shouldRunIntro && status !== 'done';

  // Register hero media stage before paint so Preloader can animate it directly
  useLayoutEffect(() => {
    registerHeroStage({
      mediaWrap: mediaRef.current,
      video: videoRef.current,
      scrim: scrimRef.current,
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

      if (!shouldRunIntro) {
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
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.04]"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>

          {/* Ambient Dark Overlay Scrim */}
          <div
            ref={scrimRef}
            data-hero-scrim
            className="absolute inset-0 bg-black/25 pointer-events-none"
          />
        </div>

        {/* Hero Content Container pinned to bottom-left & bottom-right */}
        <div
          data-hero-content
          style={shouldRunIntro && status === 'pending' ? { visibility: 'hidden' } : undefined}
          className={`absolute inset-0 pointer-events-none flex flex-col justify-end ${
            isIntroActive ? 'z-[945]' : 'z-10'
          }`}
        >
          <div className="w-full px-8 md:px-12 lg:px-20 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Bottom-Left: Tag & Headline */}
            <div className="w-full max-w-[520px]">
              <div
                data-hero-sub
                className="text-sm md:text-base font-normal text-white/80 tracking-normal mb-3"
              >
                Professional Architectural & 3D Visualization Studio
              </div>

              <h1
                data-hero-title
                className="font-sans text-3xl sm:text-4xl md:text-[48px] font-normal leading-[1.2] text-white tracking-[-0.5px]"
              >
                Bring your projects to<br />
                life with world-class<br />
                3D visualization
              </h1>
            </div>

            {/* Bottom-Right: Dual Minimal Rectangular Buttons */}
            <div
              data-hero-actions
              className="pointer-events-auto flex items-center gap-2 self-start md:self-auto"
            >
              {/* Button 1: Portfolio (Glass Translucent) */}
              <a
                href="#portfolio"
                className="group relative inline-flex items-center justify-center overflow-hidden h-[54px] px-5 bg-white/15 hover:bg-white text-white hover:text-[#222222] backdrop-blur-md transition-colors duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                <div className="h-5 overflow-hidden flex flex-col">
                  <div className="flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                    <span className="h-5 flex items-center text-sm md:text-base font-medium">
                      Portfolio
                    </span>
                    <span className="h-5 flex items-center text-sm md:text-base font-medium">
                      Portfolio
                    </span>
                  </div>
                </div>
              </a>

              {/* Button 2: Start project (Solid White) */}
              <button
                onClick={onOpenInquiry}
                className="group relative inline-flex items-center justify-center overflow-hidden h-[54px] px-6 bg-[#FFFFFF] hover:bg-[#2A2A2A] text-[#222222] hover:text-white transition-colors duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
              >
                <div className="h-5 overflow-hidden flex flex-col">
                  <div className="flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                    <span className="h-5 flex items-center text-sm md:text-base font-medium whitespace-nowrap">
                      Start project
                    </span>
                    <span className="h-5 flex items-center text-sm md:text-base font-medium whitespace-nowrap">
                      Start project
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
