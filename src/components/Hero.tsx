import React from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Play } from 'lucide-react';

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Glow Orbs in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#e45d36]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header Content */}
      <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Studio Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium tracking-wide mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#e45d36] animate-pulse" />
          <span>Professional Architectural & 3D Visualization Studio</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          Bring your projects to life with{' '}
          <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            world-class
          </span>{' '}
          3D visualization
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl mb-10 leading-relaxed">
          Arcade Architects crafts photorealistic architectural renderings, bespoke luxury interiors, and monumental pavilions for forward-thinking developers and architects worldwide.
        </p>

        {/* Hero Dual Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#portfolio"
            className="bloom-btn h-12 px-7 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium tracking-wide border border-white/15 backdrop-blur-md"
          >
            <div className="bloom-btn-inner h-12">
              <span className="h-12 flex items-center gap-2">
                Explore Portfolio <ArrowDown className="w-4 h-4" />
              </span>
              <span className="h-12 flex items-center gap-2">
                View Works <ArrowDown className="w-4 h-4" />
              </span>
            </div>
          </a>

          <button
            onClick={onOpenInquiry}
            className="bloom-btn h-12 px-8 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white text-sm font-semibold tracking-wide shadow-xl shadow-[#e45d36]/25"
          >
            <div className="bloom-btn-inner h-12">
              <span className="h-12 flex items-center gap-2">
                Start Project <ArrowUpRight className="w-4 h-4" />
              </span>
              <span className="h-12 flex items-center gap-2">
                Get a Quote <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Cinematic Showcase Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 aspect-[16/9] max-h-[680px] w-full bg-[#151518]">
        {/* Architectural Video / Loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/Exterior/Hazi Bari Project/01.png"
          className="w-full h-full object-cover filter brightness-95 contrast-105"
        >
          <source src="https://bloom-viz.b-cdn.net/Video_calab4k_cler.webm" type="video/webm" />
          {/* Fallback image */}
          <img
            src="/assets/Exterior/Hazi Bari Project/01.png"
            alt="Arcade Architects Showreel"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />

        {/* Overlay Badges */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
          <div className="glass-card px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-[#e45d36]/20 border border-[#e45d36]/30 flex items-center justify-center text-[#e45d36]">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white tracking-wide">Arcade Cinematic Showreel</p>
              <p className="text-[11px] text-white/50">Photorealistic Light & Form Simulation</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs text-white/70">
            <Sparkles className="w-3.5 h-3.5 text-[#e45d36]" />
            <span>4K D5 & Corona Render Architecture</span>
          </div>
        </div>
      </div>
    </section>
  );
};

