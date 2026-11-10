import React, { useState, useEffect, useRef } from 'react';

export const AboutSection: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const manifestoText =
    "By combining architectural creativity with technical expertise, we ensure every visual reflects a thoughtful and collaborative process shaped by your ideas.";

  const words = manifestoText.split(" ");

  // Studio statistics
  const stats = [
    { value: '25+', label: 'Projects' },
    { value: '100%', label: 'Satisfaction' },
    { value: '8+', label: 'Years Experience' },
    { value: '2', label: 'Team Members' },
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
        <div className="max-w-[848px] mb-12 md:mb-16">
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
        <div className="w-full border-t border-[#E5E5E5] pt-8 md:pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-center ${
                  idx % 2 === 0
                    ? 'border-r border-[#E5E5E5] pr-6 sm:pr-10'
                    : 'pl-6 sm:pl-10'
                } ${
                  idx < 3
                    ? 'lg:border-r lg:border-[#E5E5E5]'
                    : 'lg:border-r-0'
                } lg:px-10 first:lg:pl-0 last:lg:pr-0`}
              >
                <div className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#2E2E2E] leading-none tracking-tight mb-2 sm:mb-2.5">
                  {stat.value}
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#2E2E2E]/60 font-light tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
