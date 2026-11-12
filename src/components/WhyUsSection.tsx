import React, { useState, useEffect, useRef } from 'react';

interface WhyUsSectionProps {
  onOpenInquiry: () => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ onOpenInquiry: _onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Direct DOM refs for 120fps GPU transform updates — zero React re-render lag!
  const strokeRef0 = useRef<HTMLDivElement>(null);
  const strokeRef1 = useRef<HTMLDivElement>(null);
  const strokeRef2 = useRef<HTMLDivElement>(null);
  const strokeRef3 = useRef<HTMLDivElement>(null);
  const strokeRefs = [strokeRef0, strokeRef1, strokeRef2, strokeRef3];

  const advantages = [
    {
      number: '01',
      title: 'Endless creative potential for bold ideas',
      description:
        'Your vision sets the scale – we match it. Whether shaping a skyline, launching a commercial flagship, or building a bespoke luxury residence, our 3D visualization and design pipelines scale with your ambition.',
      image: '/assets/Exterior/Hazi Bari Project/1.jpg',
    },
    {
      number: '02',
      title: 'Fast delivery. Clear process. No surprises',
      description:
        'Our efficient workflows and transparent communication ensure fast turnaround with no unexpected delays. You stay informed about milestones, camera angles, lighting passes, and final delivery.',
      image: '/assets/Interior/Cafe/1.jpg',
    },
    {
      number: '03',
      title: 'Global vision. Local architectural insight',
      description:
        'With clients and projects worldwide, we bring a global perspective while respecting regional context. From local materials to international architectural standards, we craft visuals that speak to your market.',
      image: '/assets/Exhibition/Ford/1.jpg',
    },
    {
      number: '04',
      title: 'Architectural expertise at our foundation',
      description:
        'With registered architects and 3D visualizers leading our team, we understand structural volume, spatial circulation, and authentic materiality – bringing your vision to life with depth and precision.',
      image: '/assets/Exterior/CHANDINA PROJECT/1.jpg',
    },
  ];

  // High-performance RAF scroll engine synced directly to Lenis & native scroll
  useEffect(() => {
    let isTicking = false;

    const updateStrokes = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the section reaches top: 0, it sticks for 200vh of scroll
      const stickyRunway = rect.height - windowHeight;
      if (stickyRunway <= 0) return;

      const scrolledInside = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledInside / stickyRunway));

      // 1. Update stroke DOM nodes directly (GPU accelerated scaleX, zero layout reflow, 120fps)
      strokeRefs.forEach((ref, idx) => {
        if (!ref.current) return;
        const itemStart = idx * 0.25;
        const itemEnd = (idx + 1) * 0.25;

        let scale = 0;
        let opacity = 0;

        if (progress >= itemEnd) {
          scale = 1;
          opacity = idx === activeIndexRef.current ? 1 : 0.35;
        } else if (progress >= itemStart) {
          scale = (progress - itemStart) / 0.25;
          opacity = 1;
        } else {
          scale = 0;
          opacity = 0;
        }

        ref.current.style.transform = `scaleX(${scale})`;
        ref.current.style.opacity = `${opacity}`;
      });

      // 2. Only trigger React state change when active item boundary changes!
      const nextIndex = Math.min(3, Math.floor(progress / 0.25));
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const onScroll = () => {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(() => {
          updateStrokes();
          isTicking = false;
        });
      }
    };

    // Listen to Lenis smooth scroll ticker for instantaneous momentum response
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on('scroll', onScroll);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    updateStrokes();

    return () => {
      if (lenis) {
        lenis.off('scroll', onScroll);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleItemClick = (idx: number) => {
    activeIndexRef.current = idx;
    setActiveIndex(idx);

    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const stickyRunway = rect.height - windowHeight;
    if (stickyRunway <= 0) return;

    const targetScroll = window.scrollY + rect.top + (idx * 0.25 + 0.12) * stickyRunway;
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.8 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="advantages"
      data-nav-theme="light"
      className="relative z-20 w-full h-[300vh] bg-[#F7F7F7] text-[#2E2E2E]"
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center px-8 md:px-16 lg:px-20">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Column: Numbered Advantages Accordion (Width: 50%) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-[48px] font-normal leading-[1.2] md:leading-[57.6px] text-[#2E2E2E] tracking-[-0.5px] mb-8 sm:mb-12">
              Why work with us?
            </h2>

            <div className="flex flex-col">
              {advantages.map((adv, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={adv.number}
                    onClick={() => handleItemClick(idx)}
                    className="relative cursor-pointer py-4 sm:py-5 group transition-colors"
                  >
                    {/* Base static hairline divider on top */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#E5E5E5]" />

                    {/* Animated dynamic stroke on top — 120fps GPU scaleX, zero layout reflow, zero lag */}
                    <div
                      ref={strokeRefs[idx]}
                      className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#161616] pointer-events-none origin-left"
                      style={{
                        transform: 'scaleX(0)',
                        opacity: 0,
                        willChange: 'transform, opacity',
                      }}
                    />

                    {/* Advantage Header */}
                    <div className="flex items-center gap-4 sm:gap-6 pt-1">
                      <div
                        className={`font-mono text-sm sm:text-base font-normal transition-colors duration-300 ${
                          isActive ? 'text-[#2E2E2E]' : 'text-[#2E2E2E]/40'
                        }`}
                      >
                        {adv.number}
                      </div>

                      <h3
                        className={`font-sans text-lg sm:text-xl md:text-2xl font-normal transition-colors duration-300 ${
                          isActive ? 'text-[#2E2E2E]' : 'text-[#2E2E2E]/40 group-hover:text-[#2E2E2E]/70'
                        }`}
                      >
                        {adv.title}
                      </h3>
                    </div>

                    {/* Advantage Body (Expands when active) */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isActive ? 'max-h-40 opacity-100 mt-3 sm:mt-4 pl-8 sm:pl-10' : 'max-h-0 opacity-0 mt-0 pl-8 sm:pl-10'
                      }`}
                    >
                      <p className="font-sans text-sm sm:text-base font-light text-[#2E2E2E]/75 leading-relaxed max-w-lg">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Bottom closing border */}
              <div className="w-full h-[1px] bg-[#E5E5E5]" />
            </div>
          </div>

          {/* Right Column: Architectural Image Display with Cross-Fade (Width: 50%) */}
          <div className="hidden lg:block w-1/2 h-[72vh] relative overflow-hidden bg-[#E5E5E5]">
            {advantages.map((adv, idx) => {
              const isActive = idx === activeIndex;

              return (
                <div
                  key={adv.number}
                  className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isActive
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={adv.image}
                    alt={adv.title}
                    className="w-full h-full object-cover filter brightness-[0.94]"
                  />
                  {/* Subtle dark bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
