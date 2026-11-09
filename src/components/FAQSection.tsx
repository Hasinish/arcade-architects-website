import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { faqList } from '../data/faq';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 md:px-8 max-w-5xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e45d36] mb-3">
          <HelpCircle className="w-4 h-4" />
          <span>Clarity & Answers</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          You asked, we answered
        </h2>
        <p className="text-sm sm:text-base text-white/50 mt-3">
          Everything you need to know about partnering with Arcade Architects for design and 3D visualization.
        </p>
      </div>

      <div className="space-y-4">
        {faqList.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-[#18181c] border-white/20 shadow-lg'
                  : 'bg-[#131316] border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-display text-base sm:text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-[#e45d36] text-white rotate-180' : 'bg-white/5 text-white/50'
                  }`}
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-white/70 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

