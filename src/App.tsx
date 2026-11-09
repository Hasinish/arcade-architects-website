import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
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
    <div className="min-h-screen bg-[#0d0d0e] text-[#f5f5f7] relative selection:bg-[#e45d36] selection:text-white">
      {/* Top Floating Navbar */}
      <Navbar
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenSchedule={() => setScheduleOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenInquiry={() => handleOpenInquiry()} />
        <PortfolioSection onOpenInquiryWithProject={(name) => handleOpenInquiry(name)} />
        <ServicesSection onOpenInquiry={() => handleOpenInquiry()} />
        <AboutSection />
        <WhyUsSection onOpenInquiry={() => handleOpenInquiry()} />
        <ReviewsSection />
        <FAQSection />
        <CTASection
          onOpenInquiry={() => handleOpenInquiry()}
          onOpenSchedule={() => setScheduleOpen(true)}
        />
      </main>

      {/* Architectural Studio Footer */}
      <Footer />

      {/* Interactive Modals */}
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
