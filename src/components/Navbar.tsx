import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useCinematicNavigation } from '../context/PageTransitionContext';

interface NavbarProps {
  onOpenInquiry?: () => void;
  onOpenSchedule?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogoDarkBg, setIsLogoDarkBg] = useState(true);
  const [isBurgerDarkBg, setIsBurgerDarkBg] = useState(true);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateWithCurtain } = useCinematicNavigation();

  // Real-time pixel color calculation under Logo and Hamburger
  useEffect(() => {
    // Hidden 1x1 canvas for real-time pixel extraction
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const samplePixelDarkness = (x: number, y: number): boolean => {
      const elements = document.elementsFromPoint(x, y);

      for (const el of elements) {
        // Skip navbar itself, drawer, and modals
        if (el.closest('header') || el.closest('aside') || el.closest('[role="dialog"]')) continue;

        // 1. Real-time Image pixel extraction via Canvas
        const img = el.tagName === 'IMG' ? (el as HTMLImageElement) : el.querySelector('img');
        if (img && img.complete && img.naturalWidth > 0) {
          try {
            const rect = img.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
              const rx = (x - rect.left) / rect.width;
              const ry = (y - rect.top) / rect.height;
              const sx = Math.floor(rx * img.naturalWidth);
              const sy = Math.floor(ry * img.naturalHeight);

              if (ctx) {
                ctx.clearRect(0, 0, 1, 1);
                ctx.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
                const p = ctx.getImageData(0, 0, 1, 1).data;
                if (p[3] > 20) {
                  // ITU-R BT.709 relative luminance
                  const lum = (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255;
                  return lum < 0.5;
                }
              }
            }
          } catch {
            // Ignore potential cross-origin image errors
          }
        }

        // 2. Video element sampling
        if (el.tagName === 'VIDEO' || el.querySelector('video')) {
          return true;
        }

        // 3. Computed CSS background-color sampling
        const bg = window.getComputedStyle(el).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
          if (a > 0.08) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            return lum < 0.5;
          }
        }
      }

      // Root default (Near top on home with hero is dark, otherwise light)
      return location.pathname === '/' && window.scrollY < 450;
    };

    let rafId: number | null = null;
    const calculatePixels = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Sample exact pixel under Logo (x = 64, y = 48)
        const logoDark = samplePixelDarkness(64, 48);
        setIsLogoDarkBg(logoDark);

        // Sample exact pixel under Hamburger (x = window.innerWidth - 48, y = 48)
        const burgerDark = samplePixelDarkness(window.innerWidth - 48, 48);
        setIsBurgerDarkBg(burgerDark);
      });
    };

    window.addEventListener('scroll', calculatePixels, { passive: true });
    window.addEventListener('resize', calculatePixels);
    calculatePixels();

    // Trigger on route transitions (immediate, 120ms, and 450ms after curtain opens)
    const t1 = setTimeout(calculatePixels, 120);
    const t2 = setTimeout(calculatePixels, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', calculatePixels);
      window.removeEventListener('resize', calculatePixels);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Control Lenis smooth scroll when drawer toggles
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;
    if (drawerOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [drawerOpen]);

  // Adaptive colors for Logo & Burger based on real-time pixel luminance & drawer state:
  // If pixel under element is dark -> element is LIGHT (white #FFFFFF)
  // If pixel under element is light -> element is DARK (charcoal #2E2E2E)
  const burgerColor = drawerOpen
    ? 'bg-[#222222]'
    : isBurgerDarkBg
    ? 'bg-[#FFFFFF]'
    : 'bg-[#2E2E2E]';

  const logoColor = drawerOpen
    ? 'text-[#222222]'
    : isLogoDarkBg
    ? 'text-[#FFFFFF]'
    : 'text-[#2E2E2E]';

  const logoFilter = drawerOpen
    ? 'brightness-0'
    : isLogoDarkBg
    ? 'brightness-100 invert'
    : 'brightness-0';

  const handleNavClick = (path: string) => {
    setDrawerOpen(false);
    if (path === '/contacts') {
      navigateWithCurtain('/contacts');
      return;
    }
    if (path === '/' && window.location.pathname === '/contacts') {
      navigateWithCurtain('/');
      return;
    }
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (window.location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        navigateWithCurtain(`/#${hash}`);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Fixed Top Bar (Exactly at top: 32px, left: 32px, right: 32px) */}
      <header className="fixed top-0 left-0 right-0 z-[900] px-8 pt-8 pointer-events-none transition-colors duration-300">
        <div className="w-full flex items-center justify-between">
          {/* Top-Left: Minimal Brand Mark & Wordmark */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === '/contacts') {
                e.preventDefault();
                navigateWithCurtain('/');
              }
            }}
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
          </Link>

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
        data-lenis-prevent
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#FFFFFF] text-[#2E2E2E] z-[850] shadow-2xl transition-transform duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-between p-8 sm:p-12 overflow-y-auto ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Top: Exactly 4 Clean Nav Links */}
        <div className="pt-4">
          <nav className="flex flex-col gap-7">
            <div>
              <button
                onClick={() => handleNavClick('/')}
                className="font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] bloom-nav-link text-left"
              >
                Home
              </button>
            </div>

            <div>
              <button
                onClick={() => handleNavClick('/#portfolio')}
                className="font-sans text-[32px] font-normal leading-[1.2] text-[#2E2E2E] bloom-nav-link text-left"
              >
                Portfolio
              </button>
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
                  <button
                    onClick={() => handleNavClick('/#services')}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors text-left"
                  >
                    3D interior visualization
                  </button>
                  <button
                    onClick={() => handleNavClick('/#services')}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors text-left"
                  >
                    3D architectural visualization
                  </button>
                  <button
                    onClick={() => handleNavClick('/#services')}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors text-left"
                  >
                    Exhibition & pavilion architecture
                  </button>
                  <button
                    onClick={() => handleNavClick('/#services')}
                    className="text-[19px] font-normal py-1 hover:text-[#2E2E2E] transition-colors text-left"
                  >
                    3D walkthrough animation
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => handleNavClick('/contacts')}
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
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => setDrawerOpen(false)}
              className="bloom-btn-wrap flex-1 !h-[54px] !px-4 !bg-[#222222] !text-white text-sm"
            >
              <div className="btn-text-track">
                <div className="btn-text-inner">
                  <span className="btn-label flex items-center justify-center">
                    Schedule a call <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </span>
                  <span className="btn-label flex items-center justify-center">
                    Schedule a call <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            </a>

            {/* Discuss the Project Button */}
            <button
              onClick={() => handleNavClick('/contacts')}
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
