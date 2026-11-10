import React, { useState, useEffect, useRef } from 'react';

export const AboutSection: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const manifestoText =
    "By combining architectural creativity with technical expertise, we ensure every visual reflects a thoughtful and collaborative process shaped by your ideas.";

  const words = manifestoText.split(" ");

  // Genuine studio stats
  const stats = [
    { value: '25+', label: 'Projects' },
    { value: '100%', label: 'Satisfaction' },
    { value: '8+', label: 'Years Experience' },
    { value: '12', label: 'Team Members' },
  ];

  // Continuous scroll scrubbing for word illumination
  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start illuminating when text enters middle of screen, complete when reaching upper third
      const startTrigger = windowHeight * 0.85;
      const endTrigger = windowHeight * 0.35;
      const progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
      const clamped = Math.max(0, Math.min(1, progress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about" data-nav-theme="light" className="relative z-20 w-full bg-[#F7F7F7] text-[#2E2E2E] py-24 md:py-36 px-8 md:px-16 lg:px-20">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Large Editorial Manifesto with Word-by-Word Scroll Illumination */}
        <div className="max-w-[848px] mb-24 md:mb-32">
          <h2
            ref={textRef}
            className="font-sans text-3xl sm:text-4xl md:text-[48px] font-normal leading-[1.2] md:leading-[57.6px] tracking-[-0.5px] select-none"
          >
            {words.map((word, idx) => {
              // Threshold for this specific word
              const wordThreshold = idx / (words.length - 1);
              const isIlluminated = scrollProgress >= wordThreshold;

              return (
                <span
                  key={idx}
                  className="inline-block transition-colors duration-150 mr-[0.28em] last:mr-0"
                  style={{
                    color: isIlluminated ? 'rgb(46, 46, 46)' : 'rgba(46, 46, 46, 0.18)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Minimal Horizontal Statistics Strip with Thin Vertical Dividers */}
        <div className="w-full border-t border-[#E5E5E5] pt-12 md:pt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 items-center justify-between">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-start lg:px-8 first:lg:pl-0 last:lg:pr-0">
                  <div className="font-sans text-3xl sm:text-4xl md:text-[40px] font-normal text-[#2E2E2E] leading-none mb-3">
                    {stat.value}
                  </div>
                  <div className="font-sans text-sm sm:text-base text-[#2E2E2E]/60 font-light">
                    {stat.label}
                  </div>
                </div>

                {/* Thin vertical divider (hidden on last item and on small mobile grids) */}
                {idx < stats.length - 1 && (
                  <div className="hidden lg:block w-[1px] h-[64px] bg-[#E5E5E5] self-center" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
