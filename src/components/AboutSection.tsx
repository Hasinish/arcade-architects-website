import React from 'react';
import { Award, Compass, Globe, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { value: '350+', label: 'Projects Completed', icon: Award },
    { value: '85+', label: 'Satisfied Clients', icon: Globe },
    { value: '10+', label: 'Years of Architecture', icon: Compass },
    { value: '4.9★', label: 'Google Rating', icon: Sparkles },
  ];

  return (
    <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e45d36] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e45d36]" />
          Our Philosophy
        </div>

        {/* Oversized Bloom3D editorial manifesto */}
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-snug">
          By combining architectural creativity with photorealistic technical expertise, we ensure every visual reflects a{' '}
          <span className="text-[#e45d36] underline decoration-white/20 underline-offset-8">
            thoughtful and collaborative process
          </span>{' '}
          shaped by your boldest ideas.
        </h2>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 hover:border-white/15 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#e45d36] mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/50 font-medium">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

