import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { WhyUsSection } from './components/WhyUsSection';
import { CTASection } from './components/CTASection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { ScheduleCallModal } from './components/ScheduleCallModal';

export const App: React.FC = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedProjectForInquiry, setSelectedProjectForInquiry] = useState<string | undefined>(undefined);

  const handleOpenInquiry = (projectName?: string) => {
    setSelectedProjectForInquiry(projectName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#2E2E2E] relative selection:bg-[#2E2E2E] selection:text-white overflow-x-clip">
      {/* Top Corner-Pinned Minimal Navbar */}
      <Navbar
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenSchedule={() => setScheduleOpen(true)}
      />

      {/* Main Content Sections Reconstructed in Bloom3D Sequence */}
      <main>
        {/* Phase 2: Full-Bleed Pinned Hero */}
        <Hero onOpenInquiry={() => handleOpenInquiry()} />

        {/* Phase 3: Pinned Curtain Rising Portfolio Grid */}
        <PortfolioSection onOpenInquiryWithProject={(name) => handleOpenInquiry(name)} />

        {/* Phase 4: 3D Cylindrical Perspective Services Carousel */}
        <ServicesSection onOpenInquiry={() => handleOpenInquiry()} />

        {/* Phase 5A: Manifesto Word-by-Word Scroll Scrub About Section */}
        <AboutSection />

        {/* Phase 5B: 300vh Sticky Stage Pinned Advantages Section */}
        <WhyUsSection onOpenInquiry={() => handleOpenInquiry()} />

        {/* Phase 6A: Fullscreen Architectural Parallax CTA */}
        <CTASection
          onOpenInquiry={() => handleOpenInquiry()}
          onOpenSchedule={() => setScheduleOpen(true)}
        />

        {/* Phase 6B: Editorial 2-Column Minimal FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Phase 6C: High-Fidelity Architectural Studio Footer */}
      <Footer onOpenInquiry={() => handleOpenInquiry()} />

      {/* Interactive Inquiries & Consultation Modals */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        prefilledProject={selectedProjectForInquiry}
      />

      <ScheduleCallModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </div>
  );
};

export default App;
