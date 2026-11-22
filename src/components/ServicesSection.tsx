import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesSectionProps {
  onOpenInquiry: (serviceName?: string) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  objectPosition?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 7 Architectural Services for Arcade Architects
  const services: ServiceItem[] = [
    {
      id: 'exterior-viz',
      title: 'Architectural Exterior Visualization',
      description: 'Photorealistic exterior stills, atmospheric daylight and dusk studies, and rich environmental context.',
      image: '/assets/Exterior/CHANDINA PROJECT/3.jpg',
      category: 'Visualization',
      objectPosition: 'center',
    },
    {
      id: 'interior-viz',
      title: 'Bespoke Interior Visualization',
      description: 'Tactile material curation, bespoke millwork, atmospheric artificial lighting, and luxury residential styling.',
      image: '/assets/Interior/Resi/5.jpg',
      category: 'Interior Design',
      objectPosition: 'center',
    },
    {
      id: 'cinematic-3d',
      title: 'Cinematic 3D Showreels & Walkthroughs',
      description: '4K architectural films, continuous drone flyovers, fluid camera choreography, and spatial showreels.',
      image: '/assets/Exterior/Hazi Bari Project/1.jpg',
      category: 'Animation',
      objectPosition: 'center 40%',
    },
    {
      id: 'masterplanning',
      title: 'Architectural Design & Masterplanning',
      description: 'From initial conceptual massing and schematic sketches to comprehensive permit-ready drawing packages.',
      image: '/assets/Exterior/USA/2.jpg',
      category: 'Architecture',
      objectPosition: 'center',
    },
    {
      id: 'exhibition-brand',
      title: 'Commercial & Brand Pavilions',
      description: 'Monumental corporate flagships, automotive expo pavilions, and immersive public exhibition structures.',
      image: '/assets/Exhibition/Ford/2.jpg',
      category: 'Commercial',
      objectPosition: 'center',
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Cafe Architecture',
      description: 'Experiential hospitality environments, acoustic considerations, and curated commercial dining destinations.',
      image: '/assets/Interior/Cafe/1.jpg',
      category: 'Hospitality',
      objectPosition: 'center',
    },
    {
      id: 'construction-oversight',
      title: 'Turnkey Construction & Site Oversight',
      description: 'Comprehensive structural coordination, statutory clearance oversight, and hands-on site management in Bangladesh.',
      image: '/assets/Exterior/KOTBARI PROJECT/1.jpg',
      category: 'Construction',
      objectPosition: 'center 35%',
    },
  ];

  const total = services.length;

  // 5 full repeating sets (35 items) to guarantee seamless infinite continuity on all screen sizes up to 8K
  const SET_COUNT = 5;
  const displayItems = useRef(
    Array.from({ length: SET_COUNT * total }, (_, i) => ({
      ...services[i % total],
      globalIndex: i,
      serviceIndex: i % total,
    }))
  ).current;

  // Active service index (triggers React re-render ONLY when centered service changes)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Dragging state for UI styling
  const [isDragging, setIsDragging] = useState(false);

  // Physics, animation, and coordinate references
  const currentXRef = useRef(0);
  const velocityRef = useRef(-25); // px/sec (right to left = negative)
  const modeRef = useRef<'AUTO' | 'DRAGGING' | 'MOMENTUM' | 'TWEEN'>('AUTO');
  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Drag tracking refs
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartTrackXRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const hasMovedRef = useRef(false);
  const isTouchLockedRef = useRef(false);

  // Tween tracking refs
  const tweenStartRef = useRef(0);
  const tweenDurationRef = useRef(400);
  const tweenDeltaXRef = useRef(0);
  const tweenLastProgressRef = useRef(0);

  // Cinematic constant auto speed (25px per second right-to-left)
  const AUTO_SPEED = useRef(-25);

  // Responsive metrics calculation
  const getMetrics = useCallback(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
    if (width >= 1024) {
      return { itemWidth: 500, itemHeight: 375, gap: 16 };
    } else if (width >= 768) {
      return { itemWidth: 380, itemHeight: 285, gap: 14 };
    } else {
      return { itemWidth: 280, itemHeight: 210, gap: 12 };
    }
  }, []);

  const metricsRef = useRef(getMetrics());

  // Eagerly preload all 7 service images on mount
  useEffect(() => {
    services.forEach((service) => {
      const img = new Image();
      img.src = service.image;
    });

    // Check user reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      AUTO_SPEED.current = 0;
      velocityRef.current = 0;
    }
  }, []);

  // Update metrics on resize while preserving currently centered service
  useEffect(() => {
    const handleResize = () => {
      const newMetrics = getMetrics();
      metricsRef.current = newMetrics;

      const { itemWidth, gap } = newMetrics;
      const step = itemWidth + gap;
      const cycleWidth = total * step;
      const screenCenterX = window.innerWidth / 2;

      // Center the active service in Set 2 without any sudden jump
      const currentActive = activeIndexRef.current;
      const targetTileGlobalIndex = 2 * total + currentActive;
      let newX = screenCenterX - targetTileGlobalIndex * step - itemWidth / 2;

      const minX = -2 * cycleWidth;
      const maxX = -1 * cycleWidth;
      while (newX < minX) newX += cycleWidth;
      while (newX >= maxX) newX -= cycleWidth;

      currentXRef.current = newX;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${newX}px, 0, 0)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getMetrics, total]);

  // Initial centering of Service 0
  useEffect(() => {
    const { itemWidth, gap } = metricsRef.current;
    const step = itemWidth + gap;
    const cycleWidth = total * step;
    const screenCenterX = window.innerWidth / 2;

    // Center tile 14 (Set 2, Service 0)
    const initialTileIndex = 2 * total; // 14
    let initX = screenCenterX - initialTileIndex * step - itemWidth / 2;

    const minX = -2 * cycleWidth;
    const maxX = -1 * cycleWidth;
    while (initX < minX) initX += cycleWidth;
    while (initX >= maxX) initX -= cycleWidth;

    currentXRef.current = initX;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${initX}px, 0, 0)`;
    }
  }, [total]);

  // Differential incremental tween helper (immune to boundary wrapping glitches)
  const startTweenDelta = useCallback((deltaX: number, duration: number = 420) => {
    modeRef.current = 'TWEEN';
    tweenDeltaXRef.current = deltaX;
    tweenLastProgressRef.current = 0;
    tweenStartRef.current = performance.now();
    tweenDurationRef.current = duration;
  }, []);

  // Main high-performance Animation Frame Loop (Zero React state updates per frame)
  useEffect(() => {
    let isRunning = true;

    const loop = (now: number) => {
      if (!isRunning) return;

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const { itemWidth, gap } = metricsRef.current;
      const step = itemWidth + gap;
      const cycleWidth = total * step;
      const minX = -2 * cycleWidth;
      const maxX = -1 * cycleWidth;

      // Only animate if the section is currently intersecting the viewport
      if (isVisibleRef.current) {
        if (modeRef.current === 'AUTO') {
          if (!isHoveredRef.current) {
            currentXRef.current += AUTO_SPEED.current * dt;

            // Seamless infinite modular wrap
            while (currentXRef.current < minX) currentXRef.current += cycleWidth;
            while (currentXRef.current >= maxX) currentXRef.current -= cycleWidth;
          }
        } else if (modeRef.current === 'MOMENTUM') {
          currentXRef.current += velocityRef.current * dt;

          // Seamless infinite modular wrap
          while (currentXRef.current < minX) currentXRef.current += cycleWidth;
          while (currentXRef.current >= maxX) currentXRef.current -= cycleWidth;

          // Target velocity is 0 when hovered, or AUTO_SPEED (-25px/s) when not hovered
          const targetSpeed = isHoveredRef.current ? 0 : AUTO_SPEED.current;
          const decayRate = isHoveredRef.current ? 4.0 : 2.4;
          const blend = 1 - Math.exp(-decayRate * dt);
          velocityRef.current += (targetSpeed - velocityRef.current) * blend;

          // Once velocity converges back to targetSpeed, smoothly transition back to AUTO mode
          if (Math.abs(velocityRef.current - targetSpeed) < 0.25) {
            velocityRef.current = targetSpeed;
            modeRef.current = 'AUTO';
          }
        } else if (modeRef.current === 'TWEEN') {
          const elapsed = now - tweenStartRef.current;
          const progress = Math.min(1, elapsed / tweenDurationRef.current);
          // Quintic ease-out curve: 1 - (1 - t)^5
          const ease = 1 - Math.pow(1 - progress, 5);

          const frameDelta = (ease - tweenLastProgressRef.current) * tweenDeltaXRef.current;
          tweenLastProgressRef.current = ease;

          currentXRef.current += frameDelta;

          // Seamless infinite modular wrap during tween
          while (currentXRef.current < minX) currentXRef.current += cycleWidth;
          while (currentXRef.current >= maxX) currentXRef.current -= cycleWidth;

          if (progress >= 1) {
            velocityRef.current = isHoveredRef.current ? 0 : AUTO_SPEED.current;
            modeRef.current = 'AUTO';
          }
        }

        // Apply hardware-accelerated transform directly to DOM
        if (trackRef.current && modeRef.current !== 'DRAGGING') {
          trackRef.current.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
        }

        // Constant-time mathematical calculation of the image closest to horizontal screen center
        const screenCenterX = window.innerWidth / 2;
        const iClosest = Math.round((screenCenterX - currentXRef.current - itemWidth / 2) / step);
        const activeIdx = ((iClosest % total) + total) % total;

        // Update React state ONLY when the centered service index actually changes
        if (activeIdx !== activeIndexRef.current) {
          activeIndexRef.current = activeIdx;
          setActiveSlideIndex(activeIdx);
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [total]);

  // IntersectionObserver to pause loop when gallery is offscreen (Conserves battery & GPU resources)
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            lastTimeRef.current = performance.now();
          }
        });
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Interactive Pointer / Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only for mouse

    modeRef.current = 'DRAGGING';
    setIsDragging(true);
    hasMovedRef.current = false;
    isTouchLockedRef.current = false;

    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTrackXRef.current = currentXRef.current;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (modeRef.current !== 'DRAGGING') return;

    const dx = e.clientX - dragStartXRef.current;
    const dy = e.clientY - dragStartYRef.current;

    // Touch discrimination: allow normal vertical page scroll on mobile
    if (e.pointerType === 'touch' && !isTouchLockedRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        // User intended vertical scroll: release drag lock and let browser/Lenis scroll
        modeRef.current = 'AUTO';
        setIsDragging(false);
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
        return;
      } else if (Math.abs(dx) > 8) {
        // User intended horizontal filmstrip drag
        isTouchLockedRef.current = true;
      } else {
        return;
      }
    }

    if (Math.abs(dx) > 4) {
      hasMovedRef.current = true;
    }

    const { itemWidth, gap } = metricsRef.current;
    const step = itemWidth + gap;
    const cycleWidth = total * step;
    const minX = -2 * cycleWidth;
    const maxX = -1 * cycleWidth;

    let newX = dragStartTrackXRef.current + dx;

    // Wrap position during drag while preserving drag offset alignment
    while (newX < minX) {
      newX += cycleWidth;
      dragStartTrackXRef.current += cycleWidth;
    }
    while (newX >= maxX) {
      newX -= cycleWidth;
      dragStartTrackXRef.current -= cycleWidth;
    }

    currentXRef.current = newX;

    // Sample pointer velocity (px/sec)
    const now = performance.now();
    const dt = (now - lastMoveTimeRef.current) / 1000;
    if (dt > 0.008) {
      const instVelocity = (e.clientX - lastMoveXRef.current) / dt;
      // Exponential moving average for smooth release velocity
      velocityRef.current = velocityRef.current * 0.35 + instVelocity * 0.65;
      lastMoveXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
    }

    // Direct GPU transform update during active drag
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${newX}px, 0, 0)`;
    }

    // Dynamic active item update during drag
    const screenCenterX = window.innerWidth / 2;
    const iClosest = Math.round((screenCenterX - newX - itemWidth / 2) / step);
    const activeIdx = ((iClosest % total) + total) % total;
    if (activeIdx !== activeIndexRef.current) {
      activeIndexRef.current = activeIdx;
      setActiveSlideIndex(activeIdx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (modeRef.current !== 'DRAGGING') return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // If pointer did not drag, treat as an intentional click / tap on the image tile
    if (!hasMovedRef.current) {
      const { itemWidth, gap } = metricsRef.current;
      const step = itemWidth + gap;
      const cycleWidth = total * step;
      const screenCenterX = window.innerWidth / 2;

      const clickedIndex = Math.floor((e.clientX - currentXRef.current) / step);
      if (clickedIndex >= 0 && clickedIndex < displayItems.length) {
        const item = displayItems[clickedIndex];
        if (item.serviceIndex === activeIndexRef.current) {
          onOpenInquiry(item.title);
        } else {
          const itemCurrentScreenCenter = currentXRef.current + item.globalIndex * step + itemWidth / 2;
          let delta = (itemCurrentScreenCenter - screenCenterX) % cycleWidth;
          if (delta > cycleWidth / 2) delta -= cycleWidth;
          if (delta < -cycleWidth / 2) delta += cycleWidth;
          startTweenDelta(-delta, 440);
        }
      }
      return;
    }

    // Check if pointer remained static before release (cancels fling)
    const timeSinceLastMove = performance.now() - lastMoveTimeRef.current;
    if (timeSinceLastMove > 65) {
      velocityRef.current = 0;
    }

    // Clamp maximum release velocity for natural momentum feel
    const MAX_VELOCITY = 1500;
    velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current));

    modeRef.current = 'MOMENTUM';
    lastTimeRef.current = performance.now();
  };

  // Keyboard navigation: Left / Right arrows shift gallery by one image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const { itemWidth, gap } = metricsRef.current;
      const step = itemWidth + gap;

      if (e.key === 'ArrowLeft') {
        // Shift right by step (bring previous image to center)
        startTweenDelta(step, 380);
      } else if (e.key === 'ArrowRight') {
        // Shift left by step (bring next image to center)
        startTweenDelta(-step, 380);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startTweenDelta]);

  // Click on individual image tile: centers that image or triggers inquiry if already centered
  const handleTileClick = (item: (typeof displayItems)[0]) => {
    if (hasMovedRef.current) return; // Ignore clicks if user was actively dragging

    const { itemWidth, gap } = metricsRef.current;
    const step = itemWidth + gap;
    const cycleWidth = total * step;
    const screenCenterX = window.innerWidth / 2;

    if (item.serviceIndex === activeIndexRef.current) {
      // Already centered: trigger inquiry
      onOpenInquiry(item.title);
    } else {
      // Shortest modular angular distance to center
      const itemCurrentScreenCenter = currentXRef.current + item.globalIndex * step + itemWidth / 2;
      let delta = (itemCurrentScreenCenter - screenCenterX) % cycleWidth;
      if (delta > cycleWidth / 2) delta -= cycleWidth;
      if (delta < -cycleWidth / 2) delta += cycleWidth;

      startTweenDelta(-delta, 440);
    }
  };

  const activeService = services[activeSlideIndex] || services[0];

  return (
    <section
      id="services"
      data-nav-theme="dark"
      ref={sectionRef}
      className="relative z-20 w-full bg-[#000000] text-white pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden select-none"
    >
      {/* Top Editorial Headline matching Arcade Architects Studio Disciplines */}
      <div className="w-full px-8 md:px-12 lg:px-20 mb-10 md:mb-14">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-[#898989] mb-4">
            Studio Disciplines
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[46px] font-light leading-[1.2] tracking-[-0.8px] text-white">
            Arcade Architects is a transdisciplinary practice crafting spatial experiences across all scales.
          </h2>
        </div>
      </div>

      {/* Horizontal Draggable Infinite Filmstrip Stage */}
      <div
        data-cursor="drag"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full overflow-hidden touch-pan-y h-[210px] md:h-[285px] lg:h-[375px] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          ref={trackRef}
          className="flex flex-nowrap items-center will-change-transform gap-3 md:gap-3.5 lg:gap-4 pointer-events-auto h-full"
        >
          {displayItems.map((item) => (
            <div
              key={`service-tile-${item.globalIndex}`}
              onClick={() => handleTileClick(item)}
              className="flex-none w-[280px] h-[210px] md:w-[380px] md:h-[285px] lg:w-[500px] lg:h-[375px] rounded-none overflow-hidden relative bg-[#141414] select-none group"
            >
              {/* Architectural subtle skeleton placeholder */}
              <div className="absolute inset-0 bg-[#1A1A1A] pointer-events-none" />

              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/Exterior/Hazi Bari Project/1.jpg';
                }}
                style={{ objectPosition: item.objectPosition || 'center' }}
                className="relative z-10 w-full h-full object-cover rounded-none filter brightness-[0.92] contrast-[1.03] transition-all duration-300 group-hover:brightness-100"
              />

              {/* Minimal architectural borderless overlay */}
              <div className="absolute inset-0 z-20 bg-black/15 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Understated Editorial Caption Area Aligned Directly Under Active Center Image */}
      <div className="w-full px-6 md:px-12 mt-8 md:mt-10 flex justify-center">
        <div
          className="w-full max-w-[500px]"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 mb-3">
                <h3 className="font-display text-lg sm:text-xl font-normal text-white tracking-tight">
                  {activeService.title}
                </h3>
                <span className="text-xs font-mono uppercase tracking-widest text-[#898989] flex-none">
                  0{activeSlideIndex + 1} / 0{total}
                </span>
              </div>

              <p className="text-sm sm:text-base font-light text-[#949494] leading-relaxed mb-4">
                {activeService.description}
              </p>

              <button
                onClick={() => onOpenInquiry(activeService.title)}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white hover:text-[#DFDFDF] transition-colors cursor-pointer group"
              >
                <span>Inquire for {activeService.category}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
