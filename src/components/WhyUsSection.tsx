import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const WhyUsSection: React.FC<{ onOpenInquiry: () => void }> = ({ onOpenInquiry }) => {
  const advantages = [
    {
      number: '01',
      title: 'Endless creative potential for bold ideas',
      description: 'Your vision sets the scale — we match it. Whether shaping a regional skyline, designing a commercial pavilion, or refining an intimate residence, our design pipelines scale with your ambition.',
    },
    {
      number: '02',
      title: 'Fast delivery. Clear process. Zero surprises',
      description: 'Milestone-driven workflows with scheduled feedback stages ensure high predictability. You inspect camera views, lighting moods, and material drafts before final high-resolution render generation.',
    },
    {
      number: '03',
      title: 'Photorealistic precision & material physics',
      description: 'We don’t settle for plastic models. We simulate real physical lighting behavior, microscopic stone and timber roughness, specular highlights, and authentic sub-tropical plant biology.',
    },
    {
      number: '04',
      title: 'Full turnkey architectural competence',
      description: 'Unlike generic 3D artists, Arcade Architects is staffed by registered architects. We understand buildability, structural loads, local zoning codes, and actual physical execution.',
    },
  ];

  return (
    <section id="advantages" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e45d36] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e45d36]" />
            Why Choose Arcade Architects
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Why work with us?
          </h2>
        </div>

        <button
          onClick={onOpenInquiry}
          className="self-start md:self-auto text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 transition-colors"
        >
          Discuss Your Project <ArrowUpRight className="w-4 h-4 text-[#e45d36]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advantages.map((adv) => (
          <div
            key={adv.number}
            className="p-8 sm:p-10 rounded-3xl bg-[#141417] border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#e45d36] mb-6 block">
                {adv.number}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-white/95">
                {adv.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {adv.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
              <span>Arcade Architecture Standard</span>
              <div className="w-2 h-2 rounded-full bg-[#e45d36]/50 group-hover:bg-[#e45d36] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

