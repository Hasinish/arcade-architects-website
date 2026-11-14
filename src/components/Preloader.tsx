import React, { useRef } from 'react';
import { EASE, gsap, setupGsap, useGSAP } from '../lib/gsap';
import { useIntro } from '../context/IntroContext';

/**
 * Six supporting Arcade Architects visuals flanking the live Hero video center stage.
 */
const ARCADE_PRELOADER_IMAGES = [
  '/assets/Exterior/USA/2.jpg',
  '/assets/Exhibition/Ford/2.jpg',
  '/assets/Interior/Cafe/1.jpg',
  '/assets/Interior/Appart/New folder/1.jpg',
  '/assets/Exterior/Hazi Bari Project/1.jpg',
  '/assets/Exterior/Laksam Project/1.jpg',
];

export interface PreloaderProps {
  images?: string[];
  ratio?: number;
  fanRatio?: number;
  fanGap?: number;
  centerHeight?: number;
  label?: string;
  className?: string;
}

const clip = (v: number, h: number) => `inset(${v}% ${h}% ${v}% ${h}%)`;
const HIDDEN = clip(50, 50);

/* Responsive stack geometry: center frame is full-viewport clipped to a centered window;
   supporting frames share the same base size and fan out geometrically above & below. */
function getLayout(
  rings: number,
  ratio: number,
  fanRatio: number,
  fanGap: number,
  centerHeight: number,
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scales = Array.from({ length: rings }, (_, i) => fanRatio ** (i + 1));

  const halfColumn = 0.5 + scales.reduce((a, s) => a + s * (1 + fanGap), 0);
  let height = Math.min(vh * centerHeight, (vw * 0.62) / ratio);
  height = Math.min(height, (vh * 0.48) / halfColumn);
  const width = height * ratio;

  const offsets: number[] = [];
  let edge = height / 2;
  scales.forEach((s) => {
    const gap = fanGap * s * height;
    offsets.push(edge + gap + (s * height) / 2);
    edge += gap + s * height;
  });

  return {
    width,
    height,
    scales,
    offsets,
    h: ((1 - width / vw) / 2) * 100,
    v: ((1 - height / vh) / 2) * 100,
  };
}

/** Waits for image decode, capped at `ms` so slow assets never trap the user. */
const decodeWithin = (img: HTMLImageElement, ms: number) =>
  Promise.race([
    img.decode().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]);

export const Preloader: React.FC<PreloaderProps> = ({
  images = ARCADE_PRELOADER_IMAGES,
  ratio = 3 / 2,
  fanRatio = 0.68,
  fanGap = 0.12,
  centerHeight = 0.24,
  label = 'ARCADE ARCHITECTS',
  className = '',
}) => {
  const root = useRef<HTMLDivElement>(null);
  const { status, shouldRunIntro, claim, conduct, getHeroStage, waitForHeroVideoFrame, startHeroVideo } = useIntro();

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !shouldRunIntro) return;
      setupGsap();
      claim();

      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = 'hidden';

      const lenis = (window as unknown as { lenis?: { stop: () => void } }).lenis;
      lenis?.stop();

      let cancelled = false;
      let ctx: gsap.Context | undefined;

      const others = gsap.utils.toArray<HTMLElement>('[data-frame]', el);
      const otherImgs = others.map((f) => f.querySelector('img') as HTMLImageElement);

      const run = async () => {
        // Yield until sibling Hero's useLayoutEffect commits heroStageRef
        await Promise.resolve();
        if (cancelled) return;

        // Ensure fonts, supporting images, and the single Hero <video> playable buffer are ready
        await Promise.all([
          document.fonts.ready,
          ...otherImgs.map((img) => decodeWithin(img, 1800)),
          waitForHeroVideoFrame(2200),
        ]);
        if (cancelled) return;

        const heroStage = getHeroStage();
        const last = heroStage?.mediaWrap ?? null;
        const lastVideo = heroStage?.video ?? null;
        const overlay = heroStage?.scrim ?? null;
        const lastLogo = heroStage?.introLogo ?? null;

        ctx = gsap.context(() => {
          const counterEl = el.querySelector<HTMLElement>('[data-counter]')!;
          const counterWrap = el.querySelector<HTMLElement>('[data-counter-wrap]')!;
          const rings = Math.ceil(others.length / 2);
          const { width: W, height: HT, scales, offsets, h: H, v: V } = getLayout(
            rings,
            ratio,
            fanRatio,
            fanGap,
            centerHeight,
          );

          // Initial state: supporting cards + Hero video wrapper collapsed behind center clip-path
          if (last) gsap.set(last, { clipPath: HIDDEN });
          if (overlay) gsap.set(overlay, { autoAlpha: 0 });
          if (lastLogo) {
            lastLogo.style.setProperty('--intro-logo-size', `${Math.round(HT * 0.78)}px`);
            gsap.set(lastLogo, { autoAlpha: 1, scale: 1 });
          }
          gsap.set(others, {
            width: W,
            height: HT,
            xPercent: -50,
            yPercent: -50,
            y: 0,
            scale: 1,
            clipPath: HIDDEN,
          });
          const REVEAL_ZOOM = 1.16;

          conduct((tl) => {
            /* 1. Sequential 7-frame clip-path reveal (6 supporting images -> Hero center window) */
            const REVEAL = 0.55;
            const REVEAL_STEP = 0.13;
            others.forEach((frame, i) => {
              const p = { v: 50, h: 50 };
              tl.to(
                p,
                {
                  v: 0,
                  h: 0,
                  duration: REVEAL,
                  ease: EASE.open,
                  onUpdate: () => {
                    frame.style.clipPath = clip(p.v, p.h);
                  },
                },
                i * REVEAL_STEP,
              );
              tl.fromTo(
                otherImgs[i],
                { scale: 1.12 },
                { scale: 1, duration: REVEAL + 0.3, ease: EASE.open },
                i * REVEAL_STEP,
              );
            });

            if (last) {
              const centerStart = others.length * REVEAL_STEP;
              const p = { v: 50, h: 50 };
              tl.to(
                p,
                {
                  v: V,
                  h: H,
                  duration: REVEAL,
                  ease: EASE.open,
                  onUpdate: () => {
                    last.style.clipPath = clip(p.v, p.h);
                  },
                },
                centerStart,
              );
              if (lastVideo) {
                tl.fromTo(
                  lastVideo,
                  { scale: REVEAL_ZOOM + 0.12 },
                  { scale: REVEAL_ZOOM, duration: REVEAL + 0.3, ease: EASE.open },
                  centerStart,
                );
              }
            }
            const revealEnd = others.length * REVEAL_STEP + REVEAL;

            /* 2. Geometric vertical fan-out above and below center frame */
            const FAN = 1.15;
            const fanStart = revealEnd - 0.1;
            const spread = [...others].reverse();
            spread.forEach((frame, k) => {
              const ring = Math.floor(k / 2);
              const dir = k % 2 === 0 ? -1 : 1;
              tl.to(
                frame,
                { y: dir * offsets[ring], scale: scales[ring], duration: FAN, ease: EASE.fan },
                fanStart + k * 0.04,
              );
            });
            const loadEnd = fanStart + (spread.length - 1) * 0.04 + FAN;
            tl.addLabel('loaded', loadEnd);

            /* 3. Continuous 0 -> 100 tabular counter synchronized to loadEnd */
            const count = { v: 0 };
            tl.to(
              count,
              {
                v: 100,
                duration: loadEnd,
                ease: EASE.tally,
                onUpdate: () => {
                  counterEl.textContent = String(Math.round(count.v));
                },
              },
              0,
            );

            /* 4. Counter exits cleanly, single Hero <video> starts playing & expands fullscreen as wings collapse */
            tl.to(
              counterWrap,
              { yPercent: -120, autoAlpha: 0, duration: 0.6, ease: 'power3.in' },
              'loaded-=0.1',
            );

            const OPEN = 1.6;
            const inset = { v: V, h: H };
            tl.call(() => startHeroVideo(), [], 'loaded+=0.1');
            if (last) {
              tl.to(
                inset,
                {
                  v: 0,
                  h: 0,
                  duration: OPEN,
                  ease: EASE.unveil,
                  onUpdate: () => {
                    last.style.clipPath = clip(inset.v, inset.h);
                  },
                },
                'loaded+=0.1',
              );
            }
            if (lastVideo) {
              tl.to(lastVideo, { scale: 1, duration: OPEN + 0.5, ease: EASE.unveil }, 'loaded+=0.1');
            }
            tl.to(
              spread,
              {
                y: 0,
                scale: (k: number) => scales[Math.floor(k / 2)] * 0.7,
                duration: OPEN * 0.85,
                ease: EASE.unveil,
                stagger: { each: 0.035, from: 'end' },
              },
              'loaded+=0.1',
            );
            // Match Hero.tsx's bg-black/25 overlay scrim during expansion
            if (overlay) {
              tl.to(overlay, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 'loaded+=0.5');
            }

            /* 5. Once whole video is revealed fullscreen, fade out the negative Arcade logo, then reveal Hero + Navbar texts */
            const videoRevealedAt = `loaded+=${0.1 + OPEN}`;
            if (lastLogo) {
              tl.to(
                lastLogo,
                { autoAlpha: 0, scale: 0.96, duration: 0.55, ease: 'power2.out' },
                videoRevealedAt,
              );
            }
            tl.addLabel('reveal', `loaded+=${0.1 + OPEN + 0.25}`);
          });
        }, el);
      };

      run();

      return () => {
        cancelled = true;
        html.style.overflow = prevOverflow;
        ctx?.revert();
      };
    },
    { scope: root, dependencies: [shouldRunIntro, claim, conduct, getHeroStage, waitForHeroVideoFrame, startHeroVideo, ratio, fanRatio, fanGap, centerHeight] },
  );

  if (!shouldRunIntro || status === 'done') return null;

  return (
    <div
      ref={root}
      data-preloader
      className={`fixed inset-0 z-[940] overflow-hidden bg-[#F7F7F7] text-[#2E2E2E] select-none ${className}`}
      aria-hidden="true"
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          data-frame
          className="absolute top-1/2 left-1/2 overflow-hidden bg-[#121212]"
          style={{ clipPath: HIDDEN, zIndex: i + 1 }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            decoding="async"
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Bottom-left counter + subtle studio label */}
      <div className="absolute bottom-6 left-6 overflow-hidden md:bottom-10 md:left-10 z-20">
        <div data-counter-wrap className="flex items-end gap-3">
          <span
            data-counter
            className="text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.85] font-medium tracking-tighter tabular-nums text-[#2E2E2E]"
          >
            0
          </span>
          <span className="mb-1 text-[10px] font-medium tracking-[0.22em] text-[#2E2E2E]/60 uppercase md:text-[11px]">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
