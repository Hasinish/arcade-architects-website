import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowUpRight, 
  Compass, 
  Clock, 
  ChevronDown
} from 'lucide-react';

export const MenuSandboxPage: React.FC = () => {
  // Active selected option: 1 | 2 | 3 | 4
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [backgroundMood, setBackgroundMood] = useState<'dark' | 'light'>('dark');

  // Option 1 hover preview state
  const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);

  // Option 2 expanded service accordion
  const [servicesExpanded, setServicesExpanded] = useState<boolean>(false);

  // Live real-time Dhaka clock
  const [dhakaTime, setDhakaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setDhakaTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Previews map for Option 1
  const option1Previews: Record<string, { img: string; subtitle: string }> = {
    portfolio: {
      img: '/assets/Exterior/CHANDINA PROJECT/1.jpg',
      subtitle: 'Selected Architectural Case Studies & 3D Masterpieces',
    },
    services: {
      img: '/assets/Interior/Cafe/1.jpg',
      subtitle: 'Photorealistic Interior, Exterior & Exhibition CGI',
    },
    studio: {
      img: '/assets/Exterior/Hazi Bari Project/1.jpg',
      subtitle: 'Our Philosophy, Registered Architects & 8+ Year Legacy',
    },
    contacts: {
      img: '/assets/Exhibition/Ford/1.jpg',
      subtitle: 'Direct Inquiries, Telegram Hotline & Studio Visits',
    },
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-500 font-sans ${
      backgroundMood === 'dark' ? 'bg-[#0E0E0E] text-white' : 'bg-[#F7F7F7] text-[#222222]'
    }`}>
      {/* =========================================================================
          TOP SANDBOX HEADER (Simulates real website header with Option Trigger)
      ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-[800] px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/Logo/Logo.png" 
            alt="Arcade Architects" 
            className={`w-6 h-6 object-contain ${backgroundMood === 'dark' ? 'invert' : 'brightness-0'}`} 
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png'; }}
          />
          <span className="font-sans text-sm md:text-base font-semibold tracking-[-0.5px]">
            ARCADE ARCHITECTS
          </span>
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 font-mono ml-2 border border-white/10">
            Sandbox Lab
          </span>
        </div>

        {/* =====================================================================
            ACTIVE OPTION TRIGGER BUTTON (Replaces Bloom3D 2-line hamburger)
        ===================================================================== */}
        <div>
          {/* OPTION 1 TRIGGER: The Capsule Pill with Pulsing Availability Light */}
          {selectedOption === 1 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 font-sans text-xs tracking-wider uppercase font-medium group cursor-pointer ${
                backgroundMood === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-black/5 hover:bg-black/10 text-[#222222] border border-black/10 shadow-sm'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Menu</span>
              <span className="text-[10px] opacity-50 group-hover:translate-x-0.5 transition-transform font-mono">
                [01]
              </span>
            </button>
          )}

          {/* OPTION 2 TRIGGER: The Monograph Split Tag */}
          {selectedOption === 2 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                backgroundMood === 'dark'
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-[#181818] text-white hover:bg-black'
              }`}
            >
              <span className="font-bold">04</span>
              <span className="opacity-40">/</span>
              <span>INDEX</span>
            </button>
          )}

          {/* OPTION 3 TRIGGER: The Blueprint Drafting Crosshair */}
          {selectedOption === 3 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`w-11 h-11 flex items-center justify-center rounded-none border transition-all duration-300 cursor-pointer group ${
                backgroundMood === 'dark'
                  ? 'border-white/30 hover:border-white text-white hover:bg-white/10'
                  : 'border-black/30 hover:border-black text-[#111111] hover:bg-black/5'
              }`}
              title="Open Technical Index"
            >
              <span className="font-mono text-lg font-light group-hover:rotate-90 transition-transform duration-300">
                +
              </span>
            </button>
          )}

          {/* OPTION 4 TRIGGER: The Floating Island Capsule */}
          {selectedOption === 4 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all duration-300 cursor-pointer ${
                backgroundMood === 'dark'
                  ? 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-white/15 backdrop-blur-md shadow-lg'
                  : 'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-md'
              }`}
            >
              <span>Explore Studio</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10">⌘M</kbd>
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          MOCK WEBPAGE BACKGROUND (To evaluate contrast & scrolling feel)
      ========================================================================= */}
      <main className="min-h-screen pt-36 pb-32 px-6 md:px-16 max-w-[1440px] mx-auto flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Awwwards Navigation Redesign Lab
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-[-1.5px] max-w-4xl mb-6">
            Bespoke Architectural Navigation Systems
          </h1>
          <p className="text-base sm:text-lg max-w-2xl opacity-70 leading-relaxed font-light mb-8">
            Bloom3D uses a standard 480px white slide-out panel with two black buttons. 
            Test these 4 distinct award-winning paradigms below to craft Arcade Architects' signature brand identity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { id: 1, title: 'Option 1: Obsidian Gallery', desc: 'Fullscreen takeover with kinetic hover image previews and live Dhaka clock.' },
              { id: 2, title: 'Option 2: 50/50 Dual-Pane', desc: 'Curated left monograph showcase card + right Swiss index with nested accordion.' },
              { id: 3, title: 'Option 3: Brutalist 4-Col Grid', desc: 'Technical blueprint specification sheet with 4 structured architectural columns.' },
              { id: 4, title: 'Option 4: Floating Island Dock', desc: 'Asymmetric top-right frosted carbon glass card leaving the page visible.' },
            ].map((opt) => (
              <div 
                key={opt.id}
                onClick={() => { setSelectedOption(opt.id); setIsMenuOpen(true); }}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedOption === opt.id 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : backgroundMood === 'dark'
                      ? 'border-white/10 bg-white/5 hover:border-white/30'
                      : 'border-black/10 bg-black/[0.02] hover:border-black/30'
                }`}
              >
                <div className="font-mono text-xs opacity-50 mb-2">0{opt.id} // PARADIGM</div>
                <h3 className="font-display text-lg font-medium mb-1">{opt.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed">{opt.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span>Launch Preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock visual preview backdrop image */}
        <div className="mt-12 w-full h-[260px] md:h-[340px] rounded-2xl overflow-hidden relative border border-white/10">
          <img 
            src="/assets/Exterior/CHANDINA PROJECT/1.jpg" 
            alt="Chandina Project" 
            className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 md:p-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-white/70">Featured Exterior Project</span>
              <h2 className="text-xl md:text-2xl font-display text-white">Chandina Residence • 2025</h2>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          PINNED BOTTOM CONTROLLER DOCK
      ========================================================================= */}
      <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[850] max-w-[95vw] sm:max-w-max bg-zinc-950/90 text-white backdrop-blur-xl border border-white/20 px-4 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Switcher tabs */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
          {[1, 2, 3, 4].map((id) => (
            <button
              key={id}
              onClick={() => { setSelectedOption(id); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedOption === id
                  ? 'bg-emerald-500 text-black font-semibold shadow'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Option {id}
            </button>
          ))}
        </div>

        {/* Trigger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{isMenuOpen ? 'Close Menu' : 'Open Option ' + selectedOption}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {/* Mood Switcher */}
        <button
          onClick={() => setBackgroundMood(backgroundMood === 'dark' ? 'light' : 'dark')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-zinc-200 text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          title="Toggle Background Theme"
        >
          <span>{backgroundMood === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
        </button>

        {/* Return to Live Site */}
        <Link
          to="/"
          className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 ml-1"
        >
          Back to Live Site
        </Link>
      </aside>

      {/* =========================================================================
          OVERLAY 1: THE CINEMATIC OBSIDIAN GALLERY (Awwwards SOTD Style)
      ========================================================================= */}
      {selectedOption === 1 && isMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#090909] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden animate-in fade-in duration-300">
          {/* Dynamic Background Preview on Hover */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Object.entries(option1Previews).map(([key, data]) => (
              <div
                key={key}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  hoveredPreview === key ? 'opacity-35 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{ transitionProperty: 'opacity, transform' }}
              >
                <img 
                  src={data.img} 
                  alt={key} 
                  className="w-full h-full object-cover filter brightness-90 saturate-125" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/70 to-transparent" />
              </div>
            ))}
          </div>

          {/* Top Bar */}
          <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <img src="/assets/Logo/Logo.png" alt="Arcade Architects" className="w-6 h-6 object-contain invert" />
              <span className="font-sans text-sm font-semibold tracking-[-0.5px]">ARCADE ARCHITECTS</span>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-mono border border-white/20 transition-colors cursor-pointer"
            >
              <span>Close</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Middle Nav Links */}
          <div className="relative z-10 my-auto py-8">
            <nav className="flex flex-col gap-2 md:gap-4">
              {[
                { key: 'portfolio', num: '01', label: 'Portfolio', link: '/#portfolio' },
                { key: 'services', num: '02', label: 'Services', link: '/#services' },
                { key: 'studio', num: '03', label: 'Studio Philosophy', link: '/#about' },
                { key: 'contacts', num: '04', label: 'Direct Inquiries', link: '/contacts' },
              ].map((item) => (
                <div
                  key={item.key}
                  onMouseEnter={() => setHoveredPreview(item.key)}
                  onMouseLeave={() => setHoveredPreview(null)}
                  className={`group flex items-baseline gap-4 md:gap-8 transition-opacity duration-300 ${
                    hoveredPreview && hoveredPreview !== item.key ? 'opacity-25' : 'opacity-100'
                  }`}
                >
                  <span className="font-mono text-sm md:text-lg text-emerald-400">
                    {item.num}
                  </span>
                  <a
                    href={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight hover:translate-x-3 transition-transform duration-300"
                  >
                    {item.label}
                  </a>
                  {hoveredPreview === item.key && (
                    <span className="hidden lg:inline-block font-mono text-xs text-white/60 tracking-wider uppercase animate-in fade-in slide-in-from-left-4">
                      — {option1Previews[item.key]?.subtitle}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Metadata Strip */}
          <div className="relative z-10 w-full pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono text-white/60">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>23.7771° N, 90.3994° E</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>DHAKA {dhakaTime || '21:18:00'} GMT+6</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white/80">COMMISSIONS OPEN Q2 2026</span>
            </div>
            <div className="flex items-center gap-4 sm:justify-end">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">INSTAGRAM ↗</a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TELEGRAM ↗</a>
              <a href="mailto:info@arcade-architects.com" className="hover:text-white transition-colors">EMAIL ↗</a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OVERLAY 2: THE 50/50 DUAL-PANE SPLIT MONOGRAPH (Mikado / Wallnut Style)
      ========================================================================= */}
      {selectedOption === 2 && isMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[940px] h-full flex flex-col md:flex-row bg-[#111111] text-white border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500">
            {/* Left Pane (Featured Monograph & Hard Metrics) */}
            <div className="hidden md:flex w-[42%] bg-[#161616] border-r border-white/10 p-8 flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 block mb-4">
                  [ FEATURED MONOGRAPH ]
                </span>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-white/10 mb-4 group relative">
                  <img 
                    src="/assets/Exterior/CHANDINA PROJECT/1.jpg" 
                    alt="Chandina Residence" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                </div>
                <h4 className="font-display text-xl font-medium text-white mb-1">Chandina Residence</h4>
                <p className="text-xs text-white/60 mb-3">Residential Spatial Visualization • 2025</p>
                <a 
                  href="/projects/exterior-chandina" 
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono uppercase"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              {/* Studio Metrics */}
              <div className="pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-white/70">
                  <span>Projects Delivered</span>
                  <span className="text-white font-bold">25+</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Client Satisfaction</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Years Experience</span>
                  <span className="text-white font-bold">8+</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Core Team</span>
                  <span className="text-white font-bold">2 Architects</span>
                </div>
              </div>
            </div>

            {/* Right Pane (Swiss Typographic Nav + Inline Accordion) */}
            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between bg-[#111111] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-white/50">ARCADE // ARCHITECTURAL INDEX</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items */}
              <div className="space-y-6">
                <div>
                  <a 
                    href="/#" 
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-3xl sm:text-4xl text-white hover:text-emerald-400 transition-colors block"
                  >
                    01 Home
                  </a>
                </div>

                <div>
                  <a 
                    href="/#portfolio" 
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-3xl sm:text-4xl text-white hover:text-emerald-400 transition-colors block"
                  >
                    02 Portfolio
                  </a>
                  <div className="flex gap-3 mt-2 font-mono text-xs text-white/40">
                    <span>• Exterior</span>
                    <span>• Interior</span>
                    <span>• Exhibition</span>
                  </div>
                </div>

                {/* Inline Accordion for Services */}
                <div>
                  <button
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className="font-display text-3xl sm:text-4xl text-white hover:text-emerald-400 transition-colors flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span>03 Services</span>
                    <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${servicesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {servicesExpanded && (
                    <div className="pl-4 mt-3 space-y-2 border-l border-emerald-500/50 text-xs font-mono text-white/70 animate-in fade-in">
                      <p>• Photorealistic Architectural CGI</p>
                      <p>• Interior Materiality & Lighting</p>
                      <p>• Commercial Exhibition Staging</p>
                      <p>• Unreal Engine Real-Time Tours</p>
                    </div>
                  )}
                </div>

                <div>
                  <a 
                    href="/contacts" 
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-3xl sm:text-4xl text-white hover:text-emerald-400 transition-colors block"
                  >
                    04 Contacts
                  </a>
                </div>
              </div>

              {/* Bottom Action Pill */}
              <div className="pt-8 mt-8 border-t border-white/10">
                <p className="text-xs text-white/60 mb-3 font-light">Ready to sculpt your next spatial vision?</p>
                <a
                  href="/contacts"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider font-mono rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Initiate Inquiry</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OVERLAY 3: THE BRUTALIST 4-COL ARCHITECTURAL SPEC SHEET (Stewart & Partners)
      ========================================================================= */}
      {selectedOption === 3 && isMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#0C0C0C] text-[#E0E0E0] p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300 font-mono">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between border-b border-white/15 pb-4 mb-8">
            <div className="flex items-center gap-4 text-xs tracking-wider">
              <span className="text-emerald-400 font-bold">[ SPECIFICATION INDEX 2026 ]</span>
              <span className="hidden sm:inline text-white/40">// ARCADE ARCHITECTS DHAKA</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-1.5 border border-white/30 hover:border-white text-xs uppercase tracking-widest text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              [ ✕ Close Sheet ]
            </button>
          </div>

          {/* 4-Column Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 my-auto divide-y md:divide-y-0 md:divide-x divide-white/15 border-y border-white/15 py-8">
            {/* Col 1: Directory */}
            <div className="md:pr-8 py-4 md:py-0">
              <span className="text-xs text-emerald-400 uppercase tracking-widest block mb-6">01 // DIRECTORY</span>
              <div className="space-y-4">
                {[
                  { label: '[01] PORTFOLIO', link: '/#portfolio' },
                  { label: '[02] EXPERTISE', link: '/#services' },
                  { label: '[03] PHILOSOPHY', link: '/#about' },
                  { label: '[04] CONTACTS', link: '/contacts' },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl lg:text-2xl font-display font-light text-white hover:text-emerald-400 hover:translate-x-2 transition-transform"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Architectural Scope */}
            <div className="md:px-8 py-4 md:py-0">
              <span className="text-xs text-emerald-400 uppercase tracking-widest block mb-6">02 // SCOPE OF WORK</span>
              <ul className="space-y-3 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">01.</span>
                  <span>Façade, Massing & High-Rise Visuals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">02.</span>
                  <span>Photorealistic Luxury Interior CGI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">03.</span>
                  <span>Automotive & Brand Pavilions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">04.</span>
                  <span>Cinematic Animation & Pre-Sales Media</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Studio Comms */}
            <div className="md:px-8 py-4 md:py-0">
              <span className="text-xs text-emerald-400 uppercase tracking-widest block mb-6">03 // COMMUNICATIONS</span>
              <div className="space-y-3 text-xs text-white/70">
                <div>
                  <span className="text-white/40 block text-[10px]">HEADQUARTERS</span>
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">DIRECT TELEGRAM</span>
                  <a href="https://t.me/hasin_business_bot" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    @hasin_business_bot ↗
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">OFFICIAL INQUIRIES</span>
                  <a href="mailto:info@arcade-architects.com" className="text-white hover:underline">
                    info@arcade-architects.com
                  </a>
                </div>
              </div>
            </div>

            {/* Col 4: Manifesto & Action */}
            <div className="md:pl-8 py-4 md:py-0 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-400 uppercase tracking-widest block mb-6">04 // EXECUTION</span>
                <p className="text-xs text-white/70 leading-relaxed font-sans font-light mb-6">
                  "We construct hyper-accurate spatial truth before physical ground is broken. Built by registered architects and CGI artists."
                </p>
              </div>

              <a
                href="/contacts"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3.5 bg-white text-black hover:bg-emerald-400 hover:text-black text-xs font-bold uppercase tracking-widest text-center transition-colors block"
              >
                REQUEST SPEC SHEET ↗
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/40">
            <span>COORDINATES: 23°49' N, 90°24' E</span>
            <span>REAL-TIME PIPELINE: ACTIVE</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          OVERLAY 4: THE FLOATING ARCHITECTURAL ISLAND / DOCK
      ========================================================================= */}
      {selectedOption === 4 && isMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-start justify-end p-6 md:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-[#121212]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-xs text-white/70 tracking-wider uppercase">ARCADE DOCK</span>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Links Styled as Sleek Pill Cards */}
            <div className="space-y-2 mb-6">
              {[
                { label: 'Home Page', link: '/#', count: 'Overview' },
                { label: 'Portfolio Works', link: '/#portfolio', count: '10 Projects' },
                { label: 'Studio Services', link: '/#services', count: '4 Pillars' },
                { label: 'About & Philosophy', link: '/#about', count: '8+ Years' },
                { label: 'Contact Studio', link: '/contacts', count: 'Direct' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.06] hover:border-white/20 transition-all group"
                >
                  <span className="font-sans text-base font-normal text-white group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-white/40 group-hover:text-emerald-400 transition-colors">
                    {item.count}
                  </span>
                </a>
              ))}
            </div>

            {/* Bottom Status Capsule */}
            <div className="pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4">
                <span>ONLINE STATUS:</span>
                <span className="text-emerald-400">REPLIES IN ~2H</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/contacts"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 px-3 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-xl text-center transition-colors"
                >
                  Discuss Project
                </a>
                <a
                  href="https://t.me/hasin_business_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl text-center border border-white/10 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Telegram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
