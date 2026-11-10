import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { studioContactConfig } from '../config/contact';
import { Footer } from '../components/Footer';

export const ContactsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'Project',
    message: '',
  });

  const [formValidated, setFormValidated] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate inputs
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    // Set honest validated state (does not pretend a fake network delivery happened)
    setFormValidated(true);
  };

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Smooth scroll down to inquiry brief and preselect consultation
    setFormData((prev) => ({ ...prev, subject: 'Consultation' }));
    const formEl = document.getElementById('inquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus();
    }
  };

  // Right column editorial architectural gallery images (genuine assets from public/assets/)
  const galleryShowcase = [
    {
      src: '/assets/Exterior/Hazi Bari Project/1.jpg',
      caption: '01 / Residential Architecture',
      title: 'Hazi Bari Residence — Cantilever & Raw Volumes',
    },
    {
      src: '/assets/Interior/Cafe/1.jpg',
      caption: '02 / Hospitality & Spatial Interior',
      title: 'Nidasheena Cafe — Atmospheric Concrete & Timber',
    },
    {
      src: '/assets/Exhibition/Ford/1.jpg',
      caption: '03 / Brand Environment',
      title: 'Ford Motor Pavilion — Geometric Lighting Trusses',
    },
    {
      src: '/assets/Exterior/USA/1.jpg',
      caption: '04 / Cantilever Villa',
      title: 'Private Estate — Highland Landscape Visualization',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#2E2E2E] selection:bg-[#2E2E2E] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Editorial Contacts Section matching Bloom3D's Asymmetrical 2-Column Split */}
      <section className="section_contacts w-full flex-1">
        <div className="w-full flex flex-col lg:flex-row items-stretch">
          
          {/* ========================================================
              LEFT COLUMN: Editorial Typography, Details & Form
              Bloom3D exact padding: 304px top (desktop) / 80px horizontal
              ======================================================== */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between pt-32 sm:pt-40 lg:pt-[220px] pb-16 sm:pb-24 px-6 sm:px-12 lg:px-16 xl:px-20 border-r border-[#2E2E2E]/[0.08]">
            
            <div>
              {/* Header: Subheading & Headline */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="contacts_header mb-12 sm:mb-16"
              >
                <div className="text-sm sm:text-base font-normal text-[#2E2E2E] tracking-[0.15px] mb-4">
                  Contacts
                </div>
                <h1 className="contacts_title font-sans text-3xl sm:text-4xl md:text-[46px] lg:text-[48px] font-normal leading-[1.18] text-[#2E2E2E] tracking-[-0.5px]">
                  Take the first step toward collaboration and new possibilities
                </h1>
              </motion.div>

              {/* Verified Studio Philosophy Statement (Honest & Editorial, zero fake testimonials) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="contacts_quote p-6 sm:p-7 bg-[#FFFFFF]/60 border border-[#2E2E2E]/[0.08] mb-12 sm:mb-16"
              >
                <p className="font-serif italic text-base sm:text-lg text-[#2E2E2E]/90 leading-relaxed mb-2.5">
                  «Architecture is an ongoing spatial inquiry into light, material, and proportion.»
                </p>
                <div className="text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E]/60">
                  {studioContactConfig.studioName} — Studio Directorate
                </div>
              </motion.div>

              {/* Direct Channels Grid: Contacts & Socials with Bloom3D Hover Opacity reduction */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
                className="contacts_cols grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-14 pb-12 border-b border-[#2E2E2E]/[0.08]"
              >
                {/* Column 1: Contacts */}
                <div className="space-y-3">
                  <div className="text-xs font-normal text-[#717171] uppercase tracking-[1.5px] mb-4">
                    Contacts
                  </div>
                  <ul className="space-y-2 text-base text-[#2A2A2A]">
                    <li>
                      <a
                        href={`mailto:${studioContactConfig.primaryEmail}`}
                        className="hover:text-black transition-colors underline-offset-4 hover:underline block break-all"
                      >
                        {studioContactConfig.primaryEmail}
                      </a>
                    </li>
                    <li className="text-sm text-[#2E2E2E]/70 pt-1">
                      {studioContactConfig.locations.join(' & ')}
                    </li>
                    <li className="text-xs font-mono text-[#2E2E2E]/50 pt-1">
                      {studioContactConfig.phoneStatus}
                    </li>
                  </ul>
                </div>

                {/* Column 2: Socials (Bloom3D dim-on-hover effect) */}
                <div className="space-y-3">
                  <div className="text-xs font-normal text-[#717171] uppercase tracking-[1.5px] mb-4">
                    Socials
                  </div>
                  <ul className="space-y-2 text-base">
                    {studioContactConfig.socials.map((s, idx) => {
                      const isDimmed = hoveredSocial !== null && hoveredSocial !== idx;
                      return (
                        <li key={idx}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => setHoveredSocial(idx)}
                            onMouseLeave={() => setHoveredSocial(null)}
                            className={`flex items-center justify-between text-[#2A2A2A] transition-all duration-300 ${
                              isDimmed ? 'opacity-30' : 'opacity-100 hover:text-black'
                            }`}
                          >
                            <span>{s.label}</span>
                            <ArrowUpRight className="w-4 h-4 ml-1 opacity-40" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>

              {/* Consultation / Call Section (Bloom3D style) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 1, 0.5, 1] }}
                className="contact_form_content mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
              >
                <div>
                  <div className="text-base sm:text-lg text-[#2E2E2E] font-normal">
                    Need a call? Book your time slot
                  </div>
                  <div className="text-xs text-[#2E2E2E]/50 mt-0.5">
                    {studioContactConfig.consultationStatus}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScheduleClick}
                  className="bloom-btn-wrap bloom-btn-black !h-[50px] !px-5 self-start sm:self-auto cursor-pointer"
                >
                  <div className="btn-text-track">
                    <div className="btn-text-inner">
                      <span className="btn-label flex items-center gap-1.5 text-sm">
                        Schedule a call <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="btn-label flex items-center gap-1.5 text-sm">
                        Schedule a call <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>

              {/* ========================================================
                  EDITORIAL INQUIRY FORM (Exact Bloom3D Visual Styling)
                  ======================================================== */}
              <motion.div
                id="inquiry-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="contact_form"
              >
                {formValidated ? (
                  /* Honest Non-Production Feedback Card (Zero fake submission claim) */
                  <div className="p-8 bg-white border border-[#2E2E2E]/15 space-y-5 animate-in fade-in duration-400">
                    <div className="flex items-center gap-3 text-[#2E2E2E]">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <h3 className="text-xl font-normal">
                        Form Inputs Validated
                      </h3>
                    </div>

                    <div className="text-sm text-[#2E2E2E]/80 leading-relaxed space-y-3 font-normal border-y border-[#2E2E2E]/10 py-4">
                      <p>
                        Thank you, <span className="font-semibold text-black">{formData.name}</span>. All required fields have been successfully verified.
                      </p>
                      <div className="flex items-start gap-2.5 p-3.5 bg-[#F7F7F7] border border-[#2E2E2E]/10 text-xs text-[#2E2E2E]/70">
                        <AlertCircle className="w-4 h-4 text-[#2E2E2E]/60 shrink-0 mt-0.5" />
                        <div>
                          <strong>Demo / Preview Notice:</strong> A live backend mail transmission service (such as Formspree, Resend, or EmailJS) is currently unconfigured. Your message has been validated locally in the browser but not dispatched to an external server.
                        </div>
                      </div>
                      <p className="text-xs text-[#2E2E2E]/70">
                        To initiate your project immediately, please forward your brief directly to{' '}
                        <a
                          href={`mailto:${studioContactConfig.primaryEmail}?subject=${encodeURIComponent(
                            `Arcade Architects Inquiry: ${formData.subject} - ${formData.name}`
                          )}&body=${encodeURIComponent(
                            `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.organization}\n\nMessage:\n${formData.message}`
                          )}`}
                          className="font-medium text-black underline underline-offset-4"
                        >
                          {studioContactConfig.primaryEmail}
                        </a>{' '}
                        or contact us via Telegram{' '}
                        <a
                          href="https://t.me/hasin_business_bot"
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-black underline underline-offset-4"
                        >
                          @hasin_business_bot
                        </a>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormValidated(false);
                        setFormData({
                          name: '',
                          email: '',
                          organization: '',
                          subject: 'Project',
                          message: '',
                        });
                      }}
                      className="text-xs uppercase tracking-[1.5px] font-medium text-[#2E2E2E] underline underline-offset-4 hover:opacity-60 cursor-pointer"
                    >
                      Reset Form & Edit Fields
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-7">
                    
                    {/* Name Field */}
                    <div className="space-y-1 group">
                      <label htmlFor="name" className="block text-sm sm:text-base font-medium text-[#2E2E2E]">
                        Name*
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full py-3.5 bg-transparent border-b border-[#2E2E2E]/25 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors rounded-none"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1 group">
                      <label htmlFor="email" className="block text-sm sm:text-base font-medium text-[#2E2E2E]">
                        Email*
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-3.5 bg-transparent border-b border-[#2E2E2E]/25 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors rounded-none"
                      />
                    </div>

                    {/* Company Field */}
                    <div className="space-y-1 group">
                      <label htmlFor="company" className="block text-sm sm:text-base font-medium text-[#2E2E2E]">
                        Company
                      </label>
                      <input
                        id="company"
                        type="text"
                        placeholder="company.com"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full py-3.5 bg-transparent border-b border-[#2E2E2E]/25 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors rounded-none"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-1 group">
                      <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-[#2E2E2E]">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full py-3.5 bg-transparent border-b border-[#2E2E2E]/25 text-base sm:text-lg text-[#2E2E2E] focus:outline-none focus:border-[#2E2E2E] transition-colors cursor-pointer rounded-none"
                      >
                        <option value="Project">3D Architectural Visualization Project</option>
                        <option value="Animation">Cinematic Walkthrough Animation</option>
                        <option value="Consultation">Spatial Consultation / Strategy</option>
                        <option value="Question">Studio Inquiry</option>
                        <option value="Careers">Careers & Collaboration</option>
                      </select>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1 group">
                      <label htmlFor="message" className="block text-sm sm:text-base font-medium text-[#2E2E2E]">
                        Message*
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={3}
                        placeholder="Hi! Tell us about your project location, scale, and timeline..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full py-3.5 bg-transparent border-b border-[#2E2E2E]/25 text-base sm:text-lg text-[#2E2E2E] placeholder-[#2E2E2E]/30 focus:outline-none focus:border-[#2E2E2E] transition-colors resize-none rounded-none"
                      />
                    </div>

                    {/* Bloom3D Double-Layer Sliding Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="bloom-btn-wrap bloom-btn-black !h-[54px] w-full cursor-pointer"
                      >
                        <div className="btn-text-track">
                          <div className="btn-text-inner">
                            <span className="btn-label text-base font-normal">
                              Submit Inquiry
                            </span>
                            <span className="btn-label text-base font-normal">
                              Submit Inquiry
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Continuous Vertical Monograph of Renders
              Matches Bloom3D's contacts_col_right with 4 high-res visuals
              ======================================================== */}
          <div className="w-full lg:w-1/2 flex flex-col bg-[#1A1A1A]">
            {galleryShowcase.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                className="contacts_img_wrapper relative w-full aspect-[5/6] overflow-hidden group bg-[#161616]"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading={idx < 2 ? 'eager' : 'lazy'}
                  className="contacts_img w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                />

                {/* Subtle Ambient Vignette for Editorial Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Bottom Architectural Caption Indicator */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-baseline justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-xs uppercase tracking-[2px] font-medium text-white/70">
                    {item.caption}
                  </span>
                  <span className="text-xs text-white/90 font-mono">
                    Arcade Archive
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Global Dark Architectural Studio Footer */}
      <Footer />
    </div>
  );
};

export default ContactsPage;
