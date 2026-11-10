import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenInquiry?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquiry }) => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    if (onOpenInquiry) {
      onOpenInquiry();
    } else {
      navigate('/contacts');
    }
  };

  return (
    <footer data-nav-theme="dark" className="w-full px-1 lg:px-1 pb-1 bg-[#F7F7F7]">
      {/* Dark Charcoal Outer Block matching Bloom3D (#222222) */}
      <div className="w-full bg-[#222222] text-white px-8 md:px-12 lg:px-[76px] pt-16 lg:pt-[76px] pb-10">
        <div className="w-full max-w-[1440px] mx-auto">
          {/* Main Footer Grid: Left Banner (4 cols) & Right Links (8 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
            {/* Left Column: CTA Callout (Width ~424px on 1440px) */}
            <div className="lg:col-span-4 flex flex-col justify-start items-start">
              <h2 className="font-display text-2xl lg:text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-white mb-8">
                Let’s talk about your next project
              </h2>

              <button
                onClick={handleContactClick}
                className="bloom-btn-wrap bloom-btn-white"
                aria-label="Get personal offer"
              >
                <div className="btn-text-track">
                  <div className="btn-text-inner">
                    <span className="btn-label">Get personal offer</span>
                    <span className="btn-label">Get personal offer</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Column: 4 Editorial Columns (Width ~852px on 1440px) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Column 1: Navigate */}
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider text-[#898989]">
                  Navigate
                </div>
                <ul className="space-y-2.5 text-[15px]">
                  <li>
                    <Link to="/#portfolio" className="text-white/80 hover:text-white transition-colors">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link to="/#services" className="text-white/80 hover:text-white transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/#about" className="text-white/80 hover:text-white transition-colors">
                      Philosophy
                    </Link>
                  </li>
                  <li>
                    <Link to="/#advantages" className="text-white/80 hover:text-white transition-colors">
                      Why Us
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleContactClick}
                      className="text-white/80 hover:text-white transition-colors text-left"
                    >
                      Contacts
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Contacts */}
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider text-[#898989]">
                  Contacts
                </div>
                <ul className="space-y-2.5 text-[15px]">
                  <li>
                    <a
                      href="mailto:contact@arcadearchitects.com"
                      className="text-white/80 hover:text-white transition-colors break-words"
                    >
                      contact@arcadearchitects.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+8801712345678"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      +880 1712-345678
                    </a>
                  </li>
                  <li className="text-white/60 text-sm pt-1">
                    Cumilla & Dhaka, Bangladesh
                  </li>
                </ul>
              </div>

              {/* Column 3: Socials */}
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider text-[#898989]">
                  Socials
                </div>
                <ul className="space-y-2.5 text-[15px]">
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://behance.net"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Behance
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Studio */}
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase tracking-wider text-[#898989]">
                  Studio
                </div>
                <ul className="space-y-2.5 text-[15px]">
                  <li>
                    <button
                      onClick={handleContactClick}
                      className="text-white/80 hover:text-white transition-colors text-left"
                    >
                      Schedule Consultation
                    </button>
                  </li>
                  <li>
                    <a
                      href="mailto:careers@arcadearchitects.com"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Back to Top */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-[#898989]">
            <div>
              © {new Date().getFullYear()} Arcade Architects. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <span>Architectural & Spatial 3D Visualization Studio</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
