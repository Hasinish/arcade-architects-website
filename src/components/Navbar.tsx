import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCinematicNavigation } from '../context/PageTransitionContext';
import { useIntro } from '../context/IntroContext';
import { EASE, gsap, setupGsap, useGSAP } from '../lib/gsap';

interface NavbarProps {
  onOpenInquiry?: () => void;
  onOpenSchedule?: () => void;
}

const formatDhakaTime = (withSeconds: boolean) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: false,
  }).format(new Date());

const DhakaClock: React.FC = () => {
  const [time, setTime] = useState<{ full: string; compact: string }>(() => ({
    full: formatDhakaTime(true),
    compact: formatDhakaTime(false),
  }));

  useEffect(() => {
    const update = () =>
      setTime({
        full: formatDhakaTime(true),
        compact: formatDhakaTime(false),
      });
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 text-[9.5px] sm:text-[11px] font-normal tracking-[0.06em] sm:tracking-[0.14em] uppercase tabular-nums select-none">
      <span className="inline-block w-1.5 h-1.5 bg-current opacity-85 shrink-0" aria-hidden="true" />
      <span>DHAKA</span>
      <span className="hidden sm:inline opacity-90">{time.full}</span>
      <span className="hidden xs:inline sm:hidden opacity-90">{time.compact}</span>
      <span className="hidden md:inline opacity-65">GMT+6</span>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isOverHero, setIsOverHero] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateWithCurtain, curtainPhase } = useCinematicNavigation();
  const { register, status: introStatus, shouldRunIntro } = useIntro();
  const hideNavForIntro = shouldRunIntro && introStatus === 'pending' && location.pathname === '/';

  // Dynamic background renders for Option 1 hover previews (preloads active section visuals)
  const hoverImages: Record<string, string> = {
    portfolio: '/assets/Random/1.png',
    services: '/assets/Random/7.png',
    about: '/assets/Random/22.png',
    contacts: '/assets/Random/10.png',
  };

  // GSAP intro entrance coordinated at `reveal+0.5s`
  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-nav-item]', el);
      if (!items.length) return;

      if (!shouldRunIntro || location.pathname !== '/') {
        gsap.set(items, { clearProps: 'transform,opacity,visibility' });
        return;
      }

      setupGsap();
      const ctx = gsap.context(() => {}, el);
      gsap.set(items, { y: -14, autoAlpha: 0 });

      const unregister = register((tl, { reveal }) => {
        ctx.add(() => {
          tl.to(
            items,
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: EASE.settle,
              stagger: 0.06,
              clearProps: 'transform,opacity,visibility',
            },
            `${reveal}+=0.5`,
          );
        });
      });

      return () => {
        unregister();
        ctx.revert();
      };
    },
    { scope: headerRef, dependencies: [register, shouldRunIntro, location.pathname] },
  );

  useEffect(() => {
    const updateOverHero = () => {
      const onHome = location.pathname === '/';
      setIsOverHero(onHome && window.scrollY < window.innerHeight * 0.9);
    };
    updateOverHero();
    window.addEventListener('scroll', updateOverHero, { passive: true });
    window.addEventListener('resize', updateOverHero, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateOverHero);
      window.removeEventListener('resize', updateOverHero);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Controlled mounting/unmounting lifecycle: ensures closed overlay leaves ZERO GPU compositing layer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let raf1: number;
    let raf2: number;

    if (drawerOpen) {
      setIsMenuMounted(true);
      // Double requestAnimationFrame ensures initial closed styling is painted before animating open
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setIsMenuVisible(true);
        });
      });
    } else {
      setIsMenuVisible(false);
      timer = setTimeout(() => {
        setIsMenuMounted(false);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [drawerOpen]);

  // Control Lenis smooth scroll when drawer toggles: only start if curtain is idle AND intro finished
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;
    if (drawerOpen) {
      lenis.stop();
    } else if (curtainPhase === 'idle' && introStatus === 'done') {
      lenis.start();
    }
  }, [drawerOpen, curtainPhase, introStatus]);

  const handleNavClick = (path: string) => {
    const lenis = (window as any).lenis;
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
      {/* Fixed Editorial Top Bar: Pure white over Hero/Menu, Exclusion-blended once scrolled onto light sections */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[960] px-5 sm:px-8 md:px-10 pt-5 sm:pt-7 md:pt-9 pointer-events-none ${
          drawerOpen || isOverHero ? 'text-white' : 'hero-negative-header'
        }`}
      >
        <div className="relative w-full flex items-center justify-between min-h-[32px]">
          {/* Top-Left: Location & Live Dhaka Clock */}
          <div
            data-nav-item
            data-nav-location
            style={hideNavForIntro ? { visibility: 'hidden' } : undefined}
            className="pointer-events-auto"
          >
            <DhakaClock />
          </div>

          {/* Top-Center: Mathematically Viewport-Centered Logo & Wordmark */}
          <Link
            to="/"
            data-nav-item
            data-nav-logo
            style={hideNavForIntro ? { visibility: 'hidden' } : undefined}
            onClick={(e) => {
              if (window.location.pathname === '/contacts') {
                e.preventDefault();
                navigateWithCurtain('/');
              }
            }}
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 group whitespace-nowrap"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
              <img
                src="/assets/Logo/Logo.png"
                alt="Arcade Architects"
                className="w-full h-full object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png';
                }}
              />
            </div>
            <span className="font-sans text-[10px] sm:text-xs md:text-[13px] font-medium tracking-[0.12em] sm:tracking-[0.16em] uppercase">
              ARCADE ARCHITECTS
            </span>
          </Link>

          {/* Top-Right: Minimal Menu Trigger (MENU label + 2 strokes morphing to X) */}
          <button
            data-nav-item
            data-nav-menu-trigger
            style={hideNavForIntro ? { visibility: 'hidden' } : undefined}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="pointer-events-auto relative flex items-center gap-2.5 py-1.5 pl-3 cursor-pointer focus:outline-none z-[960] group"
            aria-label={drawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={drawerOpen}
          >
            <span className="hidden sm:inline text-[11px] font-normal tracking-[0.14em] uppercase">
              {drawerOpen ? 'CLOSE' : 'MENU'}
            </span>
            <div className="w-5 h-2 flex flex-col justify-between">
              <span
                className={`w-5 h-[1.5px] block bg-current transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  drawerOpen ? 'rotate-45 translate-y-[3.25px]' : ''
                }`}
              />
              <span
                className={`w-5 h-[1.5px] block bg-current transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  drawerOpen ? '-rotate-45 -translate-y-[3.25px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Obsidian Architectural Gallery Overlay (Option 1) */}
      {isMenuMounted && (
        <div
          data-navbar-menu
          data-lenis-prevent
          className={`fixed inset-0 z-[950] bg-[#0A0A0A] text-white flex flex-col justify-between px-8 sm:px-12 md:px-16 pt-28 sm:pt-32 pb-8 sm:pb-12 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMenuVisible
              ? 'opacity-100 pointer-events-auto scale-100'
              : 'opacity-0 pointer-events-none scale-[0.98]'
          }`}
          aria-hidden={!drawerOpen}
        >
          {/* Dynamic Background Image Layer (Smooth fade on link hover) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {drawerOpen &&
              Object.entries(hoverImages).map(([key, src]) => (
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
            <DhakaClock />
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
      )}
    </>
  );
};
