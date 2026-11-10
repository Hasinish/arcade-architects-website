import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCinematicNavigation } from '../context/PageTransitionContext';

interface NavbarProps {
  onOpenInquiry?: () => void;
  onOpenSchedule?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogoDarkBg, setIsLogoDarkBg] = useState(true);
  const [isBurgerDarkBg, setIsBurgerDarkBg] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateWithCurtain } = useCinematicNavigation();

  // Dynamic background renders for Option 1 hover previews (preloads active section visuals)
  const hoverImages: Record<string, string> = {
    portfolio: '/assets/Exterior/CHANDINA PROJECT/1.jpg',
    services: '/assets/Exterior/CHANDINA PROJECT/3.jpg',
    about: '/assets/Exterior/Hazi Bari Project/1.jpg',
    contacts: '/assets/Exhibition/Ford/1.jpg',
  };

  // Real-time Dhaka clock for editorial metadata strip
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setDhakaTime(formatted);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

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
  const logoColor = drawerOpen
    ? 'text-white'
    : isLogoDarkBg
    ? 'text-[#FFFFFF]'
    : 'text-[#2E2E2E]';

  const logoFilter = drawerOpen
    ? 'brightness-100 invert'
    : isLogoDarkBg
    ? 'brightness-100 invert'
    : 'brightness-0';

  const burgerColor = drawerOpen
    ? 'bg-white'
    : isBurgerDarkBg
    ? 'bg-white'
    : 'bg-[#2E2E2E]';

  const handleNavClick = (path: string) => {
    // 1. Always resume Lenis immediately so scroll is never blocked
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.start();
    }
    setDrawerOpen(false);
    setHoveredItem(null);

    // 2. If navigating to /contacts
    if (path === '/contacts') {
      if (location.pathname === '/contacts') {
        if (lenis) lenis.scrollTo(0, { immediate: false, duration: 1 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      navigateWithCurtain('/contacts');
      return;
    }

    // 3. If navigating to / (Home top)
    if (path === '/') {
      if (location.pathname === '/') {
        if (lenis) lenis.scrollTo(0, { immediate: false, duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      navigateWithCurtain('/');
      return;
    }

    // 4. If navigating to an anchor like /#portfolio, /#services, /#about
    if (path.startsWith('/#')) {
      const hash = path.substring(2);

      // If ALREADY on Home ('/'):
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            const activeLenis = (window as any).lenis;
            if (activeLenis) {
              activeLenis.start();
              activeLenis.scrollTo(el, { offset: 0, duration: 1.2 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 60);
        }
        return;
      }

      // If on ANOTHER PAGE (e.g. /contacts, /projects/:id):
      // Store scroll target and navigate to Home with curtain transition
      sessionStorage.setItem('arcade_scroll_target', hash);
      navigateWithCurtain(`/#${hash}`);
      return;
    }

    navigate(path);
  };

  if (location.pathname === '/menu-sandbox') {
    return null;
  }

  return (
    <>
      {/* Fixed Top Bar (Pinned at top: 32px, left: 32px, right: 32px) */}
      <header className="fixed top-0 left-0 right-0 z-[960] px-8 pt-8 pointer-events-none transition-colors duration-300">
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
            className={`pointer-events-auto flex items-center gap-3 transition-colors duration-300 ${logoColor} group`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src="/assets/Logo/Logo.png"
                alt="Arcade Architects"
                className={`w-full h-full object-contain transition-all duration-300 ${logoFilter} group-hover:scale-105`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png';
                }}
              />
            </div>
            <span className="font-sans text-base font-medium tracking-[-0.5px]">
              ARCADE ARCHITECTS
            </span>
          </Link>

          {/* Top-Right: Morphing '=' to 'X' Hamburger Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="pointer-events-auto relative w-12 h-12 flex flex-col items-center justify-center p-3 cursor-pointer focus:outline-none z-[960] group"
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

      {/* Fullscreen Obsidian Architectural Gallery Overlay (Option 1) */}
      <div
        data-lenis-prevent
        className={`fixed inset-0 z-[950] bg-[#0A0A0A] text-white flex flex-col justify-between px-8 sm:px-12 md:px-16 pt-28 sm:pt-32 pb-8 sm:pb-12 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          drawerOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-[0.98]'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Dynamic Background Image Layer (Smooth fade on link hover) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {Object.entries(hoverImages).map(([key, src]) => (
            <div
              key={key}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                hoveredItem === key ? 'opacity-35 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              <img
                src={src}
                alt={key}
                className="w-full h-full object-cover filter brightness-90 saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
            </div>
          ))}
        </div>

        {/* Center: Main Nav Links with Crisp White Strokes & Zero Green */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto my-auto">
          <nav className="flex flex-col w-full divide-y divide-white/20 border-t border-b border-white/20">
            {[
              { key: 'portfolio', num: '01', label: 'Portfolio', path: '/#portfolio' },
              { key: 'services', num: '02', label: 'Services', path: '/#services' },
              { key: 'about', num: '03', label: 'About', path: '/#about' },
              { key: 'contacts', num: '04', label: 'Contacts', path: '/contacts' },
            ].map((item) => (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full transition-opacity duration-300 ${
                  hoveredItem && hoveredItem !== item.key ? 'opacity-25' : 'opacity-100'
                }`}
              >
                <button
                  onClick={() => handleNavClick(item.path)}
                  className="w-full py-6 sm:py-8 md:py-10 flex items-baseline justify-between text-left group cursor-pointer focus:outline-none"
                >
                  <div className="flex items-baseline gap-6 sm:gap-10 md:gap-14">
                    <span className="font-mono text-xs sm:text-sm md:text-base text-white/40 group-hover:text-white transition-colors">
                      {item.num}
                    </span>
                    <span className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-light tracking-tight text-white group-hover:translate-x-3 transition-transform duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-sm sm:text-base text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                    ↗
                  </span>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Strip: Pure Monochrome Studio Coordinates & Time (Zero Green) */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-6">
            <span>23.7771° N, 90.3994° E</span>
            <span>DHAKA {dhakaTime} GMT+6</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram ↗
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Telegram ↗
            </a>
            <a
              href="mailto:info@arcade-architects.com"
              className="hover:text-white transition-colors"
            >
              Email ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
