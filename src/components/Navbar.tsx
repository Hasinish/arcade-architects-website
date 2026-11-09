import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: () => void;
  onOpenSchedule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry, onOpenSchedule }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Studio', href: '#about' },
    { name: 'Why Us', href: '#advantages' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 rounded-full px-5 py-3 ${
          isScrolled
            ? 'glass-nav shadow-2xl shadow-black/50 border border-white/10'
            : 'bg-black/30 backdrop-blur-sm border border-white/5'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-[#e45d36] transition-colors">
            <img
              src="/assets/Logo/Logo.png"
              alt="Arcade Architects"
              className="w-full h-full object-contain filter brightness-110"
              onError={(e) => {
                // Fallback if logo path varies
                (e.currentTarget as HTMLImageElement).src = '/assets/Logo/Logo_01.png';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm md:text-base font-bold tracking-tight text-white group-hover:text-white/90">
              ARCADE ARCHITECTS
            </span>
            <span className="text-[10px] tracking-widest uppercase text-white/50 font-medium">
              Studio & Visualization
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-xs font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#e45d36]" />
            <span>Schedule Call</span>
          </button>

          {/* Bloom3D style sliding button */}
          <button
            onClick={onOpenInquiry}
            className="bloom-btn h-9 px-5 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white text-xs font-semibold tracking-wide shadow-lg shadow-[#e45d36]/20"
          >
            <div className="bloom-btn-inner h-9">
              <span className="h-9 flex items-center gap-1.5">
                Discuss Project <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
              <span className="h-9 flex items-center gap-1.5">
                Start Today <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-white/5 text-white/80 hover:text-white border border-white/10"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl glass-nav p-6 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSchedule();
                }}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10"
              >
                Schedule Call
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-[#e45d36] hover:bg-[#f16d47]"
              >
                Discuss Project
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

