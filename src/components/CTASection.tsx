import React, { useEffect, useRef, useState } from 'react';

interface CTASectionProps {
  onOpenInquiry: () => void;
  onOpenSchedule: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenInquiry, onOpenSchedule }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through section
      if (rect.top < windowHeight && rect.bottom > 0) {
        const delta = (rect.top - windowHeight * 0.5) * 0.2;
        setParallaxY(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="cta"
      data-nav-theme="dark"
      ref={sectionRef}
      className="relative w-full h-[120vh] min-h-[750px] max-h-[1350px] overflow-hidden bg-[#121212] flex flex-col justify-end"
    >
      {/* Parallax Background Architectural Visual / Showreel */}
      <div
        className="absolute inset-0 w-full h-[140%] -top-[20%] pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0)`,
        }}
      >
        <img
          src="https://cdn.prod.website-files.com/686bafaa09e3deeafa1ad8a8/6937f1d6327f71a2b72829fd_f069ebf4a9d9de326e02dbaeed24f0c5_Photorealistic%203D%20architectural%20visualization%20of%20The%20Ubud%20project.webp"
          alt="Arcade Architects Ubud Architecture"
          className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/Exterior/Hazi Bari Project/1.jpg';
          }}
        />
        {/* Subtle Dark Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
      </div>

      {/* Main Content Area Pinned to Bottom with 80px Horizontal Inset */}
      <div className="relative z-10 w-full px-8 md:px-12 lg:px-20 pb-16 md:pb-20">
        <div className="w-full max-w-[1440px] flex flex-col items-start gap-8">
          {/* Headline - Exact Bloom3D Typography (64px, 400 weight, line-height 70.4px, width 384px) */}
          <div className="w-full max-w-[384px]">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-normal leading-[1.1] tracking-[-1.5px] text-white">
              Let’s talk about your next project
            </h2>
          </div>

          {/* Action Buttons - Left-Aligned at x=80px under headline, gap=4px */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={onOpenSchedule}
              className="bloom-btn-wrap bloom-btn-white"
              aria-label="Schedule a call"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">Schedule a call</span>
                  <span className="btn-label">Schedule a call</span>
                </div>
              </div>
            </button>

            <button
              onClick={onOpenInquiry}
              className="bloom-btn-wrap bloom-btn-white"
              aria-label="Discuss the project"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">Discuss the project</span>
                  <span className="btn-label">Discuss the project</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
