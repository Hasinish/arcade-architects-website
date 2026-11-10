import React from 'react';

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  return (
    <section data-nav-theme="dark" className="relative w-full h-[200vh] -mb-[100vh] z-10">
      {/* Sticky Fullscreen 100vh Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#121212]">
        {/* Edge-to-Edge Background Architectural Visual / Showreel */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/Exterior/Hazi Bari Project/1.jpg"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92] contrast-[1.04]"
        >
          <source src="https://bloom-viz.b-cdn.net/Video_calab4k_cler.webm" type="video/webm" />
          <img
            src="/assets/Exterior/Hazi Bari Project/1.jpg"
            alt="Arcade Architects Architecture"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Ambient Dark Overlay Scrim */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Hero Content Container pinned to bottom-left & bottom-right */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
          <div className="w-full px-8 md:px-12 lg:px-20 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Bottom-Left: Tag & Headline (Calibrated to 448px matching Bloom3D) */}
            <div className="w-full max-w-[448px]">
              <div className="text-sm md:text-base font-normal text-white/80 tracking-normal mb-3">
                Professional Architectural & 3D Visualization Studio
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl md:text-[48px] font-normal leading-[1.2] text-white tracking-[-0.5px]">
                Bring your projects to<br />
                life with world-class<br />
                3D visualization
              </h1>
            </div>

            {/* Bottom-Right: Dual Minimal Rectangular Buttons */}
            <div className="pointer-events-auto flex items-center gap-2 self-start md:self-auto">
              {/* Button 1: Portfolio (Glass Translucent) */}
              <a
                href="#portfolio"
                className="group relative inline-flex items-center justify-center overflow-hidden h-[54px] px-5 bg-white/15 hover:bg-white text-white hover:text-[#222222] backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]"
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
                className="group relative inline-flex items-center justify-center overflow-hidden h-[54px] px-6 bg-[#FFFFFF] hover:bg-[#2A2A2A] text-[#222222] hover:text-white transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
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
