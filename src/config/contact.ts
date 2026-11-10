/**
 * ARCADE ARCHITECTS — STUDIO CONTACT CONFIGURATION
 * Centralized, verified studio contact information.
 * Any unverified details are strictly omitted or marked as non-production placeholders.
 */

export interface SocialLink {
  label: string;
  url: string;
  handle?: string;
  isExternal: boolean;
}

export interface ContactConfig {
  studioName: string;
  tagline: string;
  principal: string;
  locations: string[];
  primaryEmail: string;
  phoneStatus: string;
  consultationStatus: string;
  socials: SocialLink[];
  submissionStatus: {
    isConfigured: boolean;
    provider: 'unconfigured' | 'formspree' | 'resend' | 'emailjs';
    directEmailFallback: string;
  };
}

export const studioContactConfig: ContactConfig = {
  studioName: 'Arcade Architects',
  tagline: 'Professional 3D Architectural Visualization & Spatial Design Studio',
  principal: 'Hasin Ishrak',
  locations: ['Cumilla, Bangladesh', 'Dhaka, Bangladesh'],
  primaryEmail: 'hasinishrak47@gmail.com',
  phoneStatus: 'Direct line and WhatsApp consultation available upon request',
  consultationStatus: 'Strategy sessions scheduled upon project briefing review',
  socials: [
    {
      label: 'Instagram (Art & Renders)',
      url: 'https://instagram.com/the_47_gallery',
      handle: '@the_47_gallery',
      isExternal: true,
    },
    {
      label: 'Telegram Business',
      url: 'https://t.me/hasin_business_bot',
      handle: '@hasin_business_bot',
      isExternal: true,
    },
    {
      label: 'Client Portfolio & Orders',
      url: 'https://www.fiverr.com/hasinish',
      handle: '@hasinish',
      isExternal: true,
    },
  ],
  submissionStatus: {
    isConfigured: false,
    provider: 'unconfigured',
    directEmailFallback: 'hasinishrak47@gmail.com',
  },
};

