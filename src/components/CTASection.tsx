import React from 'react';
import { ArrowUpRight, PhoneCall, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onOpenInquiry: () => void;
  onOpenSchedule: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenInquiry, onOpenSchedule }) => {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#e45d36]/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="rounded-3xl bg-[#141417]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-16 text-center max-w-4xl mx-auto shadow-2xl relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#e45d36]" />
          <span>Ready to build something iconic?</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Let’s talk about your next project
        </h2>

        <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          From early conceptual massing to world-class 3D renders and physical construction, we translate ideas into spaces people remember.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenSchedule}
            className="bloom-btn h-12 px-7 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium border border-white/15"
          >
            <div className="bloom-btn-inner h-12">
              <span className="h-12 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#e45d36]" /> Schedule a Call
              </span>
              <span className="h-12 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#e45d36]" /> Book Consultation
              </span>
            </div>
          </button>

          <button
            onClick={onOpenInquiry}
            className="bloom-btn h-12 px-8 rounded-full bg-[#e45d36] hover:bg-[#f16d47] text-white text-xs sm:text-sm font-semibold shadow-xl shadow-[#e45d36]/25"
          >
            <div className="bloom-btn-inner h-12">
              <span className="h-12 flex items-center gap-2">
                Discuss the Project <ArrowUpRight className="w-4 h-4" />
              </span>
              <span className="h-12 flex items-center gap-2">
                Get an Estimate <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

