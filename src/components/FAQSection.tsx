import React, { useState } from 'react';
import { faqList } from '../data/faq';

export const FAQSection: React.FC = () => {
  // All FAQ items closed by default on page load; click to toggle
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" data-nav-theme="light" className="w-full bg-[#F7F7F7] py-24 md:py-32 px-8 md:px-12 lg:px-20 border-t border-[#EFEFEF]">
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Left Column: Heading (Width ~424px on 1440px, 4 cols) */}
        <div className="lg:col-span-4">
          <h2 className="font-display text-4xl lg:text-[48px] font-normal leading-[1.2] tracking-[-0.5px] text-[#2E2E2E]">
            You asked, we answered
          </h2>
        </div>

        {/* Right Column: Editorial Accordion (Width ~852px on 1440px, 8 cols) */}
        <div className="lg:col-span-8">
          <div className="w-full divide-y divide-[#EFEFEF] border-b border-[#EFEFEF]">
            {faqList.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="relative group">
                  {/* Subtle Hairline Hover Underline Indicator */}
                  <div className="absolute top-0 left-0 h-[1.5px] bg-[#2E2E2E] transition-all duration-300 w-0 group-hover:w-full z-10 pointer-events-none" />

                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleIndex(index)}
                    className="w-full py-6 flex items-center justify-between text-left cursor-pointer focus:outline-none transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans text-base md:text-[17px] font-medium text-[#2E2E2E] pr-6">
                      {faq.question}
                    </span>

                    {/* Minimal 18x18 Geometric Plus / Minus Icon matching Bloom3D */}
                    <div className="flex-shrink-0 text-[#2E2E2E] transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 18 18"
                        fill="none"
                        className={`w-[18px] h-[18px] transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                      >
                        <path
                          d="M8.325 9.675H4.5V8.325H8.325V4.5H9.675V8.325H13.5V9.675H9.675V13.5H8.325V9.675Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expandable Answer Panel */}
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 pb-7' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="font-sans text-[15px] leading-[1.65] text-[#2E2E2E]/80 max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
