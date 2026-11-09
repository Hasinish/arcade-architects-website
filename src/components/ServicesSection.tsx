import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Layers } from 'lucide-react';
import { services } from '../data/services';

interface ServicesSectionProps {
  onOpenInquiry: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenInquiry }) => {
  const [activeServiceId, setActiveServiceId] = useState(services[0].id);

  return (
    <section id="services" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e45d36] mb-3">
          <Layers className="w-4 h-4" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
          We craft architectural visuals & spaces that elevate your vision
        </h2>
        <p className="text-base text-white/60 font-light">
          Whether you need photorealistic render marketing assets to secure investors or comprehensive architectural design execution, we deliver precision at every scale.
        </p>
      </div>

      {/* Services Grid with Interactive Active Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Services */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {services.map((service) => {
            const isActive = service.id === activeServiceId;
            return (
              <div
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#18181c] border-white/20 shadow-xl'
                    : 'bg-[#121214] border-white/5 hover:border-white/10 hover:bg-[#151518]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[#e45d36] font-semibold">
                      {service.number}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-[#e45d36] text-white rotate-45' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Deliverables Accordion View */}
                {isActive && (
                  <div className="pt-4 border-t border-white/10 animate-in fade-in duration-200">
                    <p className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-3">
                      Key Deliverables & Specifications
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                          <CheckCircle className="w-3.5 h-3.5 text-[#e45d36] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 flex items-center justify-between">
                      <span className="text-xs text-white/50">{service.tag}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInquiry();
                        }}
                        className="text-xs font-semibold text-[#e45d36] hover:text-[#f16d47] flex items-center gap-1.5"
                      >
                        Inquire This Service <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Sticky Visual Preview Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          {services.map((service) => {
            if (service.id !== activeServiceId) return null;
            return (
              <div
                key={service.id}
                className="rounded-3xl overflow-hidden bg-[#151518] border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-white">
                      {service.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-display text-lg font-bold text-white mb-2">
                    {service.title}
                  </h4>
                  <p className="text-xs text-white/60 mb-6">
                    Fully optimized for real estate marketing, client presentations, and architectural permit clearances.
                  </p>

                  <button
                    onClick={onOpenInquiry}
                    className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shadow-lg"
                  >
                    Start With {service.title} <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

