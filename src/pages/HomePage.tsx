import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { PortfolioSection } from '../components/PortfolioSection';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
import { WhyUsSection } from '../components/WhyUsSection';
import { CTASection } from '../components/CTASection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToContacts = () => {
    navigate('/contacts');
  };

  return (
    <main>
      {/* Phase 2: Full-Bleed Pinned Hero */}
      <Hero onOpenInquiry={handleGoToContacts} />

      {/* Phase 3: Pinned Curtain Rising Portfolio Grid with Direct Links */}
      <PortfolioSection />

      {/* Phase 4: Snøhetta Draggable Variable-Scale Services Gallery */}
      <ServicesSection onOpenInquiry={handleGoToContacts} />

      {/* Phase 5A: Manifesto Word-by-Word Scroll Scrub About Section */}
      <AboutSection />

      {/* Phase 5B: 300vh Sticky Stage Pinned Advantages Section */}
      <WhyUsSection onOpenInquiry={handleGoToContacts} />

      {/* Phase 6A: Fullscreen Architectural Parallax CTA */}
      <CTASection
        onOpenInquiry={handleGoToContacts}
        onOpenSchedule={handleGoToContacts}
      />

      {/* Phase 6B: Editorial 2-Column Minimal FAQ Accordion */}
      <FAQSection />

      {/* Phase 6C: High-Fidelity Architectural Studio Footer */}
      <Footer onOpenInquiry={handleGoToContacts} />
    </main>
  );
};
