import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ServicesSectionProps {
  onOpenInquiry: (serviceName?: string) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenInquiry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 7 Architectural Services for Arcade Architects
  const services: ServiceItem[] = [
    {
      id: 'exterior-viz',
      title: 'Architectural Exterior Visualization',
      description: 'Photorealistic exterior stills, atmospheric daylight and dusk studies, and rich environmental context.',
      image: '/assets/Exterior/CHANDINA PROJECT/3.jpg',
      category: 'Visualization',
    },
    {
      id: 'interior-viz',
      title: 'Bespoke Interior Visualization',
      description: 'Tactile material curation, bespoke millwork, atmospheric artificial lighting, and luxury residential styling.',
      image: '/assets/Interior/Resi/5.jpg',
      category: 'Interior Design',
    },
    {
      id: 'cinematic-3d',
      title: 'Cinematic 3D Showreels & Walkthroughs',
      description: '4K architectural films, continuous drone flyovers, fluid camera choreography, and spatial showreels.',
      image: '/assets/Exterior/Hazi Bari Project/1.jpg',
      category: 'Animation',
    },
    {
      id: 'masterplanning',
      title: 'Architectural Design & Masterplanning',
      description: 'From initial conceptual massing and schematic sketches to comprehensive permit-ready drawing packages.',
      image: '/assets/Exterior/USA/2.jpg',
      category: 'Architecture',
    },
    {
      id: 'exhibition-brand',
      title: 'Commercial & Brand Pavilions',
      description: 'Monumental corporate flagships, automotive expo pavilions, and immersive public exhibition structures.',
      image: '/assets/Exhibition/Ford/2.jpg',
      category: 'Commercial',
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Cafe Architecture',
      description: 'Experiential hospitality environments, acoustic considerations, and curated commercial dining destinations.',
      image: '/assets/Interior/Cafe/1.jpg',
      category: 'Hospitality',
    },
    {
      id: 'construction-oversight',
      title: 'Turnkey Construction & Site Oversight',
      description: 'Comprehensive structural coordination, statutory clearance oversight, and hands-on site management in Bangladesh.',
      image: '/assets/Exterior/KOTBARI PROJECT/1.jpg',
      category: 'Construction',
    },
  ];

  const total = services.length;

  // Active progress state (continuous float for drag interpolation, snapped to integer index on settle)
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Drag interaction refs
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);
  const dragStartTime = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const targetProgressRef = useRef(0);

  // Sync ref with state
  useEffect(() => {
    currentProgressRef.current = progress;
    setActiveSlideIndex(((Math.round(progress) % total) + total) % total);
  }, [progress, total]);

  // Viewport breakpoint listener (Snøhetta breakpoint: >= 1200px)
  useEffect(() => {
    const checkBreakpoint = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // Snøhetta Mathematical Layout Formula
  // R: Slide Width Percentage
  const getSlideWidth = useCallback(
    (slideIdx: number, baseIdx: number, desktop: boolean) => {
      const active = ((baseIdx % total) + total) % total;
      if (slideIdx === active) return desktop ? 36 : 68;
      let diff = Math.abs(slideIdx - active);
      if (diff > total / 2) diff = total - diff;
      if (diff === 1) return desktop ? 24 : 50;
      return desktop ? 16 : 50;
    },
    [total]
  );

  // $: Slide Left Position Percentage
  const getSlideLeft = useCallback(
    (slideIdx: number, baseIdx: number, desktop: boolean) => {
      const activeWidth = desktop ? 36 : 68;
      const centerLeft = (100 - activeWidth) / 2;
      const active = ((baseIdx % total) + total) % total;
      if (slideIdx === active) return centerLeft;

      let diff = slideIdx - active;
      if (diff < -total / 2) diff += total;
      else if (diff > total / 2) diff -= total;

      const neighborWidth = desktop ? 24 : 50;
      const outerWidth = desktop ? 16 : 50;

      let offset = 0;
      if (diff > 0) {
        offset = activeWidth;
        if (Math.abs(diff) > 1) offset += neighborWidth;
        if (Math.abs(diff) > 2) offset += outerWidth * (Math.abs(diff) - 2);
      } else {
        offset = neighborWidth;
        if (Math.abs(diff) > 1) offset += outerWidth * (Math.abs(diff) - 1);
      }

      return centerLeft + (diff > 0 ? 1 : -1) * offset;
    },
    [total]
  );

  // Smooth Snap Animation Loop
  const animateTo = useCallback((target: number, duration: number = 400) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startProgress = currentProgressRef.current;
    const startTime = performance.now();
    targetProgressRef.current = target;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Quintic ease-out: 1 - (1 - t)^5
      const ease = 1 - Math.pow(1 - t, 5);
      const nextProgress = startProgress + (target - startProgress) * ease;

      setProgress(nextProgress);

      if (t < 1) {
        animationFrameId.current = requestAnimationFrame(tick);
      } else {
        setProgress(target);
        animationFrameId.current = null;
      }
    };

    animationFrameId.current = requestAnimationFrame(tick);
  }, []);

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartProgress.current = currentProgressRef.current;
    dragStartTime.current = performance.now();

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX.current;
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    // Step sensitivity: 30% of container width per slide
    const stepSize = containerWidth * (isDesktop ? 0.3 : 0.6);
    const deltaProgress = -deltaX / stepSize;

    setProgress(dragStartProgress.current + deltaProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaX = e.clientX - dragStartX.current;
    const elapsed = performance.now() - dragStartTime.current;
    const velocity = deltaX / Math.max(1, elapsed); // px/ms

    // Determine snap target
    let target = Math.round(currentProgressRef.current);

    // Flick recognition
    if (Math.abs(velocity) > 0.4 && Math.abs(deltaX) > 20) {
      target = velocity > 0 ? Math.floor(currentProgressRef.current) : Math.ceil(currentProgressRef.current);
    }

    animateTo(target, 450);

    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore capture release errors
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        animateTo(Math.round(currentProgressRef.current) - 1);
      } else if (e.key === 'ArrowRight') {
        animateTo(Math.round(currentProgressRef.current) + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animateTo]);

  // Compute slide transforms for current progress
  const baseIndex = Math.floor(progress);
  const fraction = progress - baseIndex;

  const activeService = services[activeSlideIndex] || services[0];

  return (
    <section
      id="services"
      data-nav-theme="dark"
      ref={containerRef}
      className="relative w-full bg-[#000000] text-white pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden select-none"
    >
      {/* Top Editorial Headline matching Snøhetta's Manifesto */}
      <div className="w-full px-8 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-[#898989] mb-4">
            Studio Disciplines
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[46px] font-light leading-[1.2] tracking-[-0.8px] text-white">
            Arcade Architects is a transdisciplinary practice crafting spatial experiences across all scales.
          </h2>
        </div>
      </div>

      {/* Horizontal Draggable Gallery Stage */}
      <div
        ref={trackRef}
        data-cursor="drag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full overflow-hidden touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          // Height matches active image aspect ratio: 36vw on desktop * 0.6667 = 24vw
          height: isDesktop ? 'clamp(260px, 24vw, 420px)' : 'clamp(200px, 45.3vw, 340px)',
        }}
      >
        {services.map((service, index) => {
          // Linear interpolation between floor and ceil
          const w0 = getSlideWidth(index, baseIndex, isDesktop);
          const w1 = getSlideWidth(index, baseIndex + 1, isDesktop);
          const l0 = getSlideLeft(index, baseIndex, isDesktop);
          const l1 = getSlideLeft(index, baseIndex + 1, isDesktop);

          // Handle wrapping boundary jump
          let currentLeft: number;
          if (Math.abs(l1 - l0) > 50) {
            // Crossed the circular boundary
            currentLeft = fraction < 0.5 ? l0 : l1;
          } else {
            currentLeft = l0 + (l1 - l0) * fraction;
          }

          const currentWidth = w0 + (w1 - w0) * fraction;
          const isActive = index === activeSlideIndex;

          return (
            <div
              key={service.id}
              onClick={(e) => {
                if (Math.abs(e.clientX - dragStartX.current) < 6) {
                  if (isActive) {
                    onOpenInquiry(service.title);
                  } else {
                    // Clicking adjacent slide centers it
                    const currentInt = Math.round(progress);
                    let diff = index - ((currentInt % total) + total) % total;
                    if (diff < -total / 2) diff += total;
                    else if (diff > total / 2) diff -= total;
                    animateTo(currentInt + diff);
                  }
                }
              }}
              className="absolute top-0 flex-none will-change-transform group transition-opacity duration-300"
              style={{
                left: `${currentLeft}%`,
                width: `${currentWidth}%`,
                // Exact 3:2 Aspect Ratio via percentage padding trick
                height: 0,
                paddingBottom: `${currentWidth * 0.666667}%`,
                zIndex: isActive ? 20 : 10,
              }}
            >
              {/* Inner Full Image Container */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#161616]">
                <img
                  src={service.image}
                  alt={service.title}
                  draggable={false}
                  className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.03] transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Subtle dark gradient overlay for depth */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                    isActive ? 'bg-black/0' : 'bg-black/25 group-hover:bg-black/10'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Understated Caption Area Aligned Directly Under Active Image */}
      <div className="w-full px-8 md:px-12 lg:px-20 mt-8 md:mt-10">
        <div
          className="transition-all duration-300"
          style={{
            marginLeft: isDesktop ? '32%' : '16%',
            width: isDesktop ? '36%' : '68%',
            maxWidth: isDesktop ? 'none' : '100%',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-3 mb-3">
            <h3 className="font-display text-lg sm:text-xl font-normal text-white tracking-tight">
              {activeService.title}
            </h3>
            <span className="text-xs font-mono uppercase tracking-widest text-[#898989]">
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
        </div>
      </div>
    </section>
  );
};
