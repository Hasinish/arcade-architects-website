import React, { useState, useEffect, useRef } from 'react';

interface WhyUsSectionProps {
  onOpenInquiry: () => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ onOpenInquiry: _onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const advantages = [
    {
      number: '01',
      title: 'Endless creative potential for bold ideas',
      description:
        'Your vision sets the scale – we match it. Whether shaping a skyline, launching a commercial flagship, or building a bespoke luxury residence, our 3D visualization and design pipelines scale with your ambition.',
      image: '/assets/Exterior/Hazi Bari Project/01.png',
    },
    {
      number: '02',
      title: 'Fast delivery. Clear process. No surprises',
      description:
        'Our efficient workflows and transparent communication ensure fast turnaround with no unexpected delays. You stay informed about milestones, camera angles, lighting passes, and final delivery.',
      image: '/assets/Interior/Cafe/nidasheena (1).jpg',
    },
    {
      number: '03',
      title: 'Global vision. Local architectural insight',
      description:
        'With clients and projects worldwide, we bring a global perspective while respecting regional context. From local materials to international architectural standards, we craft visuals that speak to your market.',
      image: '/assets/Exhibition/Ford/01_Photo - 10 (FILEminimizer).jpg',
    },
    {
      number: '04',
      title: 'Architectural expertise at our foundation',
      description:
        'With registered architects and 3D visualizers leading our team, we understand structural volume, spatial circulation, and authentic materiality – bringing your vision to life with depth and precision.',
      image: '/assets/Exterior/CHANDINA PROJECT/D.V-02.png',
    },
  ];

  // Scroll listener tracking the 300vh runway to activate 01, 02, 03, 04 sequentially
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the section reaches top: 0, it sticks for 200vh of scroll
      const stickyRunway = rect.height - windowHeight;
      if (stickyRunway <= 0) return;

      const scrolledInside = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledInside / stickyRunway));

      // 4 steps corresponding to the 4 items
      if (progress < 0.25) {
        setActiveIndex(0);
      } else if (progress < 0.5) {
        setActiveIndex(1);
      } else if (progress < 0.75) {
        setActiveIndex(2);
      } else {
        setActiveIndex(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="advantages"
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
                    onClick={() => setActiveIndex(idx)}
                    className="cursor-pointer border-b border-[#E5E5E5] py-4 sm:py-5 group transition-colors"
                  >
                    {/* Advantage Header */}
                    <div className="flex items-center gap-4 sm:gap-6">
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
