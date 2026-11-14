import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCinematicNavigation } from '../context/PageTransitionContext';
import { Hero } from '../components/Hero';
import { Preloader } from '../components/Preloader';
import { PortfolioSection } from '../components/PortfolioSection';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
import { WhyUsSection } from '../components/WhyUsSection';
import { CTASection } from '../components/CTASection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const { navigateWithCurtain } = useCinematicNavigation();
  const location = useLocation();

  // Handle smooth scroll to target section when arriving from cross-page anchor click
  useEffect(() => {
    const targetHash = sessionStorage.getItem('arcade_scroll_target') || location.hash.replace('#', '');
    if (targetHash) {
      sessionStorage.removeItem('arcade_scroll_target');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) {
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.start();
            lenis.scrollTo(el, { offset: 0, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const handleGoToContacts = () => {
    navigateWithCurtain('/contacts');
  };

  return (
    <main>
      {/* Phase 1: GSAP Component-031 Preloader Sequence */}
      <Preloader />

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
