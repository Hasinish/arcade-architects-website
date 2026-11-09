import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: () => void;
  onOpenSchedule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry, onOpenSchedule }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Adaptive colors for Logo & Burger based on scroll & drawer state
  const burgerColor = drawerOpen
    ? 'bg-[#222222]'
    : isScrolledPastHero
    ? 'bg-[#2E2E2E]'
    : 'bg-[#FFFFFF]';

  const logoColor = isScrolledPastHero && !drawerOpen
    ? 'text-[#2E2E2E]'
    : 'text-[#FFFFFF]';

  const logoFilter = isScrolledPastHero && !drawerOpen
    ? 'brightness-0'
    : 'brightness-100 invert';

  return (
    <>
      {/* Fixed Top Bar (Exactly at top: 32px, left: 32px, right: 32px) */}
      <header className="fixed top-0 left-0 right-0 z-[900] px-8 pt-8 pointer-events-none transition-colors duration-300">
        <div className="w-full flex items-center justify-between">
          {/* Top-Left: Minimal Brand Mark & Wordmark */}
          <a
            href="#"
            className={`pointer-events-auto flex items-center gap-3 transition-colors duration-300 ${logoColor}`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src="/assets/Logo/Logo.png"
                alt="Arcade Architects"
                className={`w-full h-full object-contain transition-all duration-300 ${logoFilter}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png';
                }}
              />
            </div>
            <span className="font-sans text-base font-medium tracking-[-0.5px]">
              ARCADE ARCHITECTS
            </span>
          </a>

          {/* Top-Right: 2-Line Minimal Hamburger / Close Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="pointer-events-auto relative w-12 h-12 flex flex-col items-center justify-center p-3 cursor-pointer focus:outline-none z-[910] group"
            aria-label={drawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={drawerOpen}
          >
            <div className="w-5 h-2.5 flex flex-col justify-between">
              {/* Top Line */}
              <span
                className={`w-5 h-[1.75px] block rounded-sm transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${burgerColor} ${
                  drawerOpen ? 'rotate-45 translate-y-[4.25px]' : ''
                }`}
              />
              {/* Bottom Line */}
              <span
                className={`w-5 h-[1.75px] block rounded-sm transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${burgerColor} ${
                  drawerOpen ? '-rotate-45 -translate-y-[4.25px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Dimmed Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[840] transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Off-Canvas Slide-Out White Drawer (Width: 480px, Padding: 48px) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#FFFFFF] text-[#2E2E2E] z-[850] shadow-2xl transition-transform duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between p-8 sm:p-12 overflow-y-auto ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Top: Exactly 4 Clean Nav Links */}
        <div className="pt-4">
          <nav className="flex flex-col gap-7">
            <div>
              <a
                href="#"
                onClick={() => setDrawerOpen(false)}
                className="font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] bloom-nav-link"
              >
                Home
              </a>
            </div>

            <div>
              <a
                href="#portfolio"
                onClick={() => setDrawerOpen(false)}
                className="font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] bloom-nav-link"
              >
                Portfolio
              </a>
            </div>

            {/* Services with Accordion Toggle */}
            <div className="flex flex-col">
              <button
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="flex items-center gap-2 font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] text-left focus:outline-none group"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#2E2E2E] transition-transform duration-300 ${
                    servicesExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {servicesExpanded && (
                <div className="flex flex-col gap-2.5 pt-3 pl-1 text-[#2E2E2E]/80 animate-in fade-in slide-in-from-top-2 duration-200">
                  <a
                    href="#services"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors"
                  >
                    3D interior visualization
                  </a>
                  <a
                    href="#services"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors"
                  >
                    3D architectural visualization
                  </a>
                  <a
                    href="#services"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors"
                  >
                    Exhibition & pavilion architecture
                  </a>
                  <a
                    href="#services"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors"
                  >
                    3D walkthrough animation
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenInquiry();
                }}
                className="font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] text-left bloom-nav-link"
              >
                Contacts
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom: Contact & Action Strip (Matching Bloom3D) */}
        <div className="pt-8 border-t border-black/[0.08] flex flex-col gap-4">
          <p className="text-[18px] text-[#2E2E2E] font-normal leading-snug">
            Let’s talk about your next project
          </p>

          <div className="flex items-center gap-2.5">
            {/* Schedule a Call Button */}
            <button
              onClick={() => {
                setDrawerOpen(false);
                onOpenSchedule();
              }}
              className="bloom-btn-wrap flex-1 !h-[54px] !px-4 !bg-[#222222] !text-white text-sm"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label">
                    Schedule a call <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </span>
                  <span className="btn-label">
                    Schedule a call <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            </button>

            {/* Discuss the Project Button */}
            <button
              onClick={() => {
                setDrawerOpen(false);
                onOpenInquiry();
              }}
              className="bloom-btn-wrap flex-1 !h-[54px] !px-4 !bg-[#222222] !text-white text-sm"
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
      </aside>
    </>
  );
};
